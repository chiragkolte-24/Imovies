
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize Express Application
const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.CLIENT_ORIGIN ||
      "http://localhost:5173",
  })
);

// Parse incoming JSON requests
app.use(
  express.json({
    limit: "100kb",
  })
);

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "IMovies",
  });
});

// Root Route
app.get("/", (_req, res) => {
  res.send("IMovies Backend Server Running");
});

// API Routes
app.use("/api/auth", require("./routes/auth"));

app.use("/api/movies", require("./routes/movies"));

app.use("/api/bookings", require("./routes/bookings"));

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);

  // Invalid MongoDB ID
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID",
    });
  }

  // Duplicate Database Value
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate value",
    });
  }

  // Internal Server Error
  res.status(500).json({
    message: "Something went wrong on the server",
  });
});

// Server Port
const port = Number(process.env.PORT) || 5000;

// Check Environment Variables
if (
  !process.env.MONGODB_URI ||
  !process.env.JWT_SECRET
) {
  console.error(
    "Missing MONGODB_URI or JWT_SECRET in .env"
  );

  process.exit(1);
}

// Connect MongoDB and Start Server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(
        `IMovies API running at http://localhost:${port}`
      );
    });
  })
  .catch((e) => {
    console.error(
      "MongoDB connection failed:",
      e.message
    );

    process.exit(1);
  });
