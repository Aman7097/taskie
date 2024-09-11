/**
 * User Profile Controller
 *
 * Handles operations related to updating user profiles,
 * including basic information and avatar.
 */

const User = require("../models/UserModel");
const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs").promises;

/**
 * Update user profile information
 */
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email } = req.body;

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, email } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

/**
 * Update user avatar
 */
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old avatar if it exists
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, "..", "public", user.avatar);
      await fs
        .unlink(oldAvatarPath)
        .catch((err) => console.error("Error deleting old avatar:", err));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { avatar: avatarUrl } },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ message: "Server error while updating avatar" });
  }
};
