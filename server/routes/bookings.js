
const router = require("express").Router();
const mongoose = require("mongoose");

const Movie = require("../models/Movie");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

// Protect all booking routes
router.use(auth);

// Generate valid seats: A1-A8, B1-B8, ... F1-F8
const allowed = new Set(
  Array.from(
    { length: 6 },
    (_, i) => "ABCDEF"[i]
  ).flatMap((row) =>
    Array.from(
      { length: 8 },
      (_, i) => row + (i + 1)
    )
  )
);

// Get logged-in user's bookings
router.get("/mine", async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("movie", "title poster genre")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (e) {
    next(e);
  }
});

// Create a new booking
router.post("/", async (req, res, next) => {
  try {
    const { movieId, showId, seats } = req.body;

    // Validate movie ID, show ID, and selected seats
    if (
      !mongoose.isValidObjectId(movieId) ||
      !mongoose.isValidObjectId(showId) ||
      !Array.isArray(seats) ||
      seats.length < 1 ||
      seats.length > 8 ||
      new Set(seats).size !== seats.length ||
      !seats.every((s) => allowed.has(s))
    ) {
      return res.status(400).json({
        message: "Choose 1–8 valid, distinct seats",
      });
    }

    // Find the movie and selected show
    const movie = await Movie.findById(movieId);
    const show = movie?.shows.id(showId);

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    // Check whether the show has started
    if (new Date(show.startsAt) <= new Date()) {
      return res.status(400).json({
        message: "Show already started",
      });
    }

    // Atomic reservation:
    // Prevent concurrent requests from booking the same seat
    const updated = await Movie.updateOne(
      {
        _id: movieId,
        shows: {
          $elemMatch: {
            _id: showId,
            bookedSeats: {
              $nin: seats,
            },
          },
        },
      },
      {
        $addToSet: {
          "shows.$.bookedSeats": {
            $each: seats,
          },
        },
      }
    );

    if (!updated.modifiedCount) {
      return res.status(409).json({
        message:
          "One or more seats were just booked. Refresh and try again.",
      });
    }

    // Create booking record
    try {
      const booking = await Booking.create({
        user: req.user.id,
        movie: movieId,
        showId,
        startsAt: show.startsAt,
        screen: show.screen,
        seats,
        total: seats.length * show.price,
      });

      res.status(201).json(booking);
    } catch (e) {
      // Release reserved seats if booking creation fails
      await Movie.updateOne(
        {
          _id: movieId,
          "shows._id": showId,
        },
        {
          $pull: {
            "shows.$.bookedSeats": {
              $in: seats,
            },
          },
        }
      );

      throw e;
    }
  } catch (e) {
    next(e);
  }
});

// Cancel an existing booking
router.patch("/:id/cancel", async (req, res, next) => {
  try {
    // Find and cancel a confirmed future booking
    const booking = await Booking.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
        status: "confirmed",
        startsAt: {
          $gt: new Date(),
        },
      },
      {
        $set: {
          status: "cancelled",
        },
      },
      {
        new: true,
      }
    );

    if (!booking) {
      return res.status(400).json({
        message: "Booking cannot be cancelled",
      });
    }

    // Release the booked seats
    await Movie.updateOne(
      {
        _id: booking.movie,
        "shows._id": booking.showId,
      },
      {
        $pull: {
          "shows.$.bookedSeats": {
            $in: booking.seats,
          },
        },
      }
    );

    res.json(booking);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
