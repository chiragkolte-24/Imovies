
const router = require("express").Router();

const Movie = require("../models/Movie");
const auth = require("../middleware/auth");

// Get All Movies and Search Movies
router.get("/", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").slice(0, 100);

    // Escape special characters in search query
    const filter = q
      ? {
          title: {
            $regex: q.replace(
              /[.*+?^${}()|[\]\\]/g,
              "\\$&"
            ),
            $options: "i",
          },
        }
      : {};

    const movies = await Movie.find(filter).sort({
      createdAt: -1,
    });

    res.json(movies);
  } catch (e) {
    next(e);
  }
});

// Get Movie By ID
router.get("/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.json(movie);
  } catch (e) {
    next(e);
  }
});

// Add New Movie - Admin Only
router.post(
  "/",
  auth,
  auth.admin,
  async (req, res, next) => {
    try {
      const {
        title,
        description,
        genre,
        duration,
        language,
        rating,
        poster,
        banner,
        shows,
      } = req.body;

      // Validate Movie Details
      if (
        !title ||
        !description ||
        !genre ||
        !Number.isFinite(Number(duration)) ||
        Number(duration) <= 0 ||
        !Array.isArray(shows) ||
        !shows.length
      ) {
        return res.status(400).json({
          message:
            "Enter movie details and at least one show",
        });
      }

      // Validate Show Details
      for (const s of shows) {
        if (
          !s.startsAt ||
          isNaN(new Date(s.startsAt)) ||
          Number(s.price) <= 0
        ) {
          return res.status(400).json({
            message:
              "Invalid show date or price",
          });
        }
      }

      // Create New Movie
      const movie = await Movie.create({
        title,
        description,
        genre,
        duration: Number(duration),
        language,
        rating,
        poster,
        banner,

        shows: shows.map((s) => ({
          startsAt: s.startsAt,
          screen: s.screen || "Screen 1",
          price: Number(s.price),
        })),
      });

      // Return Created Movie
      res.status(201).json(movie);
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
