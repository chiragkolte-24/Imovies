
const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User's email address
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Hashed user password
    password: {
      type: String,
      required: true,
    },

    // User role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Export User Model
module.exports = mongoose.model(
  "User",
  userSchema
);

