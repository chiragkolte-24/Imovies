
const router = require("express").Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const auth = require("../middleware/auth");

// Return public user information
const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
});

// Generate JWT Token
const token = (u) =>
  jwt.sign(
    {
      id: u.id,
      role: u.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

// Register New User
router.post("/register", async (req, res, next) => {
  try {
    let { name, email, password } = req.body;

    // Clean user input
    name = String(name || "").trim();
    email = String(email || "").trim().toLowerCase();

    // Validate registration details
    if (
      name.length < 2 ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Provide a name, valid email and password of at least 8 characters",
      });
    }

    // Check whether email already exists
    if (await User.exists({ email })) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Create new user with hashed password
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
    });

    // Return JWT and user information
    res.status(201).json({
      token: token(user),
      user: publicUser(user),
    });
  } catch (e) {
    next(e);
  }
});

// Login Existing User
router.post("/login", async (req, res, next) => {
  try {
    const email = String(
      req.body.email || ""
    )
      .trim()
      .toLowerCase();

    // Find user by email
    const user = await User.findOne({ email });

    // Verify password
    if (
      !user ||
      !(await bcrypt.compare(
        String(req.body.password || ""),
        user.password
      ))
    ) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Return JWT and user information
    res.json({
      token: token(user),
      user: publicUser(user),
    });
  } catch (e) {
    next(e);
  }
});

// Get Logged-in User Profile
router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        message: "Account not found",
      });
    }

    res.json(publicUser(user));
  } catch (e) {
    next(e);
  }
});

module.exports = router;
