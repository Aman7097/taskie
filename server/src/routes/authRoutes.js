const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController.js");
const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/UserModel.js");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to protect routes
const protect = passport.authenticate("jwt", { session: false });

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("firstName", "First Name is required").not().isEmpty(),
    check("lastName", "LastName is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  authController.register
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  authController.login
);

// @route   GET /api/auth/google
// @desc    Google OAuth
// @access  Public

// router.post("/google", async (req, res) => {
//   const { token } = req.body;
//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
//     });
//     const payload = ticket.getPayload();
//     // Use payload.sub as Google's unique identifier for the user
//     let user = await User.findOne({ googleId: payload.sub });
//     if (!user) {
//       user = new User({
//         googleId: payload.sub,
//         email: payload.email,
//         firstName: payload.given_name,
//         lastName: payload.family_name,
//       });
//       await user.save();
//     }
//     const jwtToken = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//     res.json({ token: jwtToken });
//   } catch (error) {
//     console.error("Error verifying Google token:", error);
//     res.status(400).json({ message: "Invalid token" });
//   }
// });

router.post("/google", async (req, res) => {
  const { accessToken } = req.body;

  console.log(req.body, "req.body");
  try {
    // Fetch user info using the access token
    const userInfoResponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userInfoResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userData = await userInfoResponse.json();
    console.log(userData, "userData");

    // Check if user exists, if not create a new user
    let user = await User.findOne({ googleId: userData.sub });
    if (!user) {
      user = new User({
        googleId: userData.sub,
        email: userData.email,
        firstName: userData.given_name,
        lastName: userData.family_name || " ",
      });
      await user.save();
    }

    // Create and send JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", protect, authController.getMe);

module.exports = router;
