
const mongoose = require("mongoose");

// Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    // User who booked the tickets
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Movie associated with the booking
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    // Selected show ID
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // Show date and time
    startsAt: {
      type: Date,
      required: true,
    },

    // Cinema screen
    screen: String,

    // Selected seats
    seats: {
      type: [String],
      required: true,
    },

    // Total booking amount
    total: {
      type: Number,
      required: true,
    },

    // Booking status
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

// Export Booking Model
module.exports = mongoose.model(
  "Booking",
  bookingSchema
);
