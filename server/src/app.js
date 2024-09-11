const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const path = require("path");
const setupJwtStrategy = require("./config/passport.js");

const authRoutes = require("./routes/authRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const helpRoutes = require("./routes/helpRoutes.js");

require("./config/database");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.use(passport.initialize());
setupJwtStrategy(passport);
// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Serve static files for avatars
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// For any other route, send the React app
app.get("*", helpRoutes);

module.exports = app;
