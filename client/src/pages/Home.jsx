
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  Ticket,
  ShieldCheck,
  Armchair,
} from "lucide-react";

import { useEffect, useState } from "react";
import { api } from "../api";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/movies")
      .then(setMovies)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            ✦ YOUR FRONT ROW TO ENTERTAINMENT
          </span>

          <h1>
            Every movie.
            <br />
            A <em>new adventure.</em>
          </h1>

          <p>
            Discover the latest blockbusters,
            find your perfect seat, and experience
            cinema like never before.
          </p>

          {/* Hero Buttons */}
          <div className="hero-actions">
            <Link className="btn" to="/movies">
              <Ticket size={19} />
              Explore Movies
              <ArrowRight size={18} />
            </Link>

            <a
              className="btn btn-outline"
              href="#now-showing"
            >
              <Play size={18} />
              Now Showing
            </a>
          </div>

          {/* Hero Statistics */}
          <div className="hero-stats">
            <div>
              <strong>6+</strong>
              <span>Featured Films</span>
            </div>

            <div>
              <strong>48</strong>
              <span>Seats per Show</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Online Booking</span>
            </div>
          </div>
        </div>

        <div className="hero-image" />
      </section>

      {/* Now Showing Section */}
      <section
        className="section"
        id="now-showing"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              ON THE BIG SCREEN
            </span>

            <h2>
              Now <em>Showing</em>
            </h2>
          </div>

          <Link
            to="/movies"
            className="link-red"
          >
            View all movies
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {/* Movies Grid */}
        <div className="movie-grid">
          {movies.slice(0, 6).map((m) => (
            <MovieCard
              key={m._id}
              movie={m}
            />
          ))}
        </div>

        {/* No Movies Message */}
        {!error && !movies.length && (
          <p className="muted">
            Loading movies… If nothing appears,
            run the backend seed command.
          </p>
        )}
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div>
          <Ticket />
          <h3>Easy Booking</h3>
          <p>
            Reserve tickets in just a few clicks.
          </p>
        </div>

        <div>
          <Armchair />
          <h3>Choose Your Seat</h3>
          <p>
            Pick the perfect spot for every show.
          </p>
        </div>

        <div>
          <ShieldCheck />
          <h3>Instant Confirmation</h3>
          <p>
            Your booking details are saved securely.
          </p>
        </div>
      </section>
    </>
  );
}
