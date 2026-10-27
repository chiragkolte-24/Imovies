
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Movie = require("./models/Movie");
const User = require("./models/User");

// Sample Movie Data
const samples = [
  [
    "Starlight Mission",
    "A crew races across the galaxy to save their home planet.",
    "Sci-Fi",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800",
  ],
  [
    "Midnight Chase",
    "An undercover detective faces one final impossible case.",
    "Thriller",
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=800",
  ],
  [
    "The Last Kingdom",
    "An epic story of loyalty, courage, and destiny.",
    "Action",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
  ],
  [
    "City of Dreams",
    "Two artists find hope and love in a restless city.",
    "Romance",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800",
  ],
  [
    "Ocean Secrets",
    "An adventurous team explores the mysteries of the deep.",
    "Adventure",
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800",
  ],
  [
    "Beyond the Horizon",
    "A powerful journey through friendship and discovery.",
    "Drama",
    "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800",
  ],
];

// Seed Database
(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if movies already exist
    if (!(await Movie.countDocuments())) {
      const today = new Date();

      // Create sample movies
      const movies = samples.map(
        ([title, description, genre, poster], i) => ({
          title,
          description,
          genre,
          poster,
          banner: poster,

          duration: 110 + i * 9,

          language: i % 2 ? "Hindi" : "English",

          rating: "UA",

          // Create three shows for each movie
          shows: [1, 2, 3].map((d, j) => {
            const date = new Date(today);

            date.setDate(date.getDate() + d);

            date.setHours(
              [13, 17, 20][j],
              0,
              0,
              0
            );

            return {
              startsAt: date,
              screen: `Screen ${j + 1}`,
              price: 180 + j * 40,
            };
          }),
        })
      );

      // Insert movies into database
      await Movie.insertMany(movies);

      console.log("Sample movies added");
    } else {
      console.log("Movies already exist; seed skipped");
    }

    // Create Admin Account
    if (
      process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD
    ) {
      const email =
        process.env.ADMIN_EMAIL.toLowerCase();

      // Check if admin already exists
      if (!(await User.exists({ email }))) {
        await User.create({
          name: "IMovies Admin",
          email,
          password: await bcrypt.hash(
            process.env.ADMIN_PASSWORD,
            12
          ),
          role: "admin",
        });

        console.log("Admin account created");
      } else {
        console.log("Admin account already exists");
      }
    }

    // Disconnect MongoDB
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
