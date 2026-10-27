
const mongoose = require("mongoose");

// Show Schema
const showSchema = new mongoose.Schema(
  {
    // Show date and time
    startsAt: {
      type: Date,
      required: true,
    },

    // Cinema screen
    screen: {
      type: String,
      default: "Screen 1",
    },

    // Ticket price
    price: {
      type: Number,
      required: true,
      min: 1,
    },

    // Already booked seats
    bookedSeats: {
      type: [String],
      default: [],
    },
  },
  {
    _id: true,
  }
);

// Movie Schema
const movieSchema = new mongoose.Schema(
  {
    // Movie title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Movie description
    description: {
      type: String,
      required: true,
    },

    // Movie genre
    genre: {
      type: String,
      required: true,
    },

    // Movie duration in minutes
    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    // Movie language
    language: {
      type: String,
      default: "Hindi",
    },

    // Movie certification
    rating: {
      type: String,
      default: "UA",
    },

    // Movie poster URL
    poster: {
      type: String,
      default: "",
    },

    // Movie banner URL
    banner: {
      type: String,
      default: "",
    },

    // Available movie shows
    shows: [showSchema],
  },
  {
    timestamps: true,
  }
);

// Export Movie Model
module.exports = mongoose.model(
  "Movie",
  movieSchema
);
