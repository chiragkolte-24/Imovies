
import { Link } from "react-router-dom";
import { Clock3, Star } from "lucide-react";

export default function MovieCard({ movie }) {
  return (
    <Link
      className="movie-card"
      to={"/movies/" + movie._id}
    >
      {/* Movie Poster */}
      <div className="poster">
        <img
          src={
            movie.poster ||
            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=700"
          }
          alt={movie.title}
        />

        {/* Movie Rating Badge */}
        <span className="poster-badge">
          <Star
            size={12}
            fill="currentColor"
          />
          {movie.rating}
        </span>
      </div>

      {/* Movie Information */}
      <div className="movie-card-info">
        {/* Movie Title */}
        <h3>{movie.title}</h3>

        {/* Genre and Language */}
        <p>
          {movie.genre}
          <span> • </span>
          {movie.language}
        </p>

        {/* Movie Duration */}
        <small>
          <Clock3 size={14} />
          {movie.duration} min
        </small>
      </div>
    </Link>
  );
}
