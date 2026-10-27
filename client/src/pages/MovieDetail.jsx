
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Clock3,
  CalendarDays,
  ArrowLeft,
  Ticket,
} from "lucide-react";
import { api } from "../api";

export default function MovieDetail() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/movies/" + id)
      .then(setMovie)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <section className="section page-section error">
        {error}
      </section>
    );
  }

  if (!movie) {
    return (
      <section className="section page-section">
        Loading movie…
      </section>
    );
  }

  return (
    <>
      {/* Movie Details Section */}
      <section
        className="detail-hero"
        style={{
          backgroundImage: `linear-gradient(
            90deg,
            #0a0b10 7%,
            rgba(10,11,16,.93) 44%,
            rgba(10,11,16,.45)
          ), url("${movie.banner || movie.poster}")`,
        }}
      >
        <div className="detail-layout">
          <img
            className="detail-poster"
            src={movie.poster}
            alt={movie.title}
          />

          <div>
            <Link to="/movies" className="back-link">
              <ArrowLeft size={16} />
              Back to movies
            </Link>

            <span className="eyebrow">
              NOW SHOWING
            </span>

            <h1>{movie.title}</h1>

            <p className="tags">
              <span>{movie.rating}</span>
              <span>{movie.genre}</span>
              <span>{movie.language}</span>
            </p>

            <p className="detail-desc">
              {movie.description}
            </p>

            <p className="muted">
              <Clock3 size={16} />
              {movie.duration} minutes
            </p>
          </div>
        </div>
      </section>

      {/* Available Shows Section */}
      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              PICK A TIME
            </span>

            <h2>
              Available <em>Shows</em>
            </h2>
          </div>
        </div>

        <div className="show-grid">
          {movie.shows
            .filter(
              (s) => new Date(s.startsAt) > new Date()
            )
            .map((s) => (
              <Link
                className="show-card"
                key={s._id}
                to={`/movies/${id}/shows/${s._id}`}
              >
                <div>
                  <CalendarDays size={20} />

                  <strong>
                    {new Date(s.startsAt).toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      }
                    )}
                  </strong>
                </div>

                <h3>
                  {new Date(s.startsAt).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  )}
                </h3>

                <p>{s.screen}</p>

                <div className="show-footer">
                  <span>
                    ₹{s.price} / seat
                  </span>

                  <span>
                    <Ticket size={16} />
                    Book
                  </span>
                </div>
              </Link>
            ))}
        </div>

        {/* No Upcoming Shows */}
        {!movie.shows.some(
          (s) => new Date(s.startsAt) > new Date()
        ) && (
          <p className="muted">
            No upcoming shows available.
          </p>
        )}
      </section>
    </>
  );
}
