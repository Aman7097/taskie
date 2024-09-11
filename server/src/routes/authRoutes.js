/**
 * Authentication Routes
 *
 * This module defines the routes for user authentication,
 * including registration, login, Google OAuth, and user profile retrieval.
 */

const express = require("express");
const { check } = require("express-validator");
const passport = require("passport");
const authController = require("../controllers/authController.js");

const router = express.Router();

// Middleware to protect routes
const protect = passport.authenticate("jwt", { session: false });

/**
 * Validation middleware for registration
 */
const registerValidation = [
  check("firstName", "First Name is required").notEmpty(),
  check("lastName", "Last Name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
];

/**
 * Validation middleware for login
 */
const loginValidation = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", registerValidation, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post("/login", loginValidation, authController.login);

/**
 * @route   POST /api/auth/google
 * @desc    Authenticate user with Google OAuth
 * @access  Public
 */
router.post("/google", authController.googleAuth);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", protect, authController.getMe);

module.exports = router;
