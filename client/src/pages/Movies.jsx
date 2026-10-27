
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { api } from "../api";
import MovieCard from "../components/MovieCard";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api("/movies")
      .then(setMovies)
      .catch((e) => setError(e.message));
  }, []);

  const filtered = movies.filter((m) =>
    (m.title + " " + m.genre + " " + m.language)
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <section className="section page-section">
      <span className="eyebrow">
        FIND YOUR NEXT FAVORITE
      </span>

      <h1 className="page-title">
        Explore <em>Movies</em>
      </h1>

      <div className="search-box">
        <Search size={20} />

        <input
          placeholder="Search movies, genres, languages…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && (
        <p className="error">{error}</p>
      )}

      <div className="movie-grid">
        {filtered.map((m) => (
          <MovieCard
            key={m._id}
            movie={m}
          />
        ))}
      </div>

      {!error && !filtered.length && (
        <p className="muted">
          No movies found.
        </p>
      )}
    </section>
  );
}
