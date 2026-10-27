
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Admin() {
  const navigate = useNavigate();

  // Form State
  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "Action",
    duration: "120",
    language: "Hindi",
    rating: "UA",
    poster: "",
    banner: "",
    startsAt: "",
    price: "200",
    screen: "Screen 1",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Handle Form Submission
  async function submit(e) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      const {
        startsAt,
        price,
        screen,
        ...movie
      } = form;

      const result = await api("/movies", {
        method: "POST",
        body: JSON.stringify({
          ...movie,
          duration: Number(movie.duration),
          shows: [
            {
              startsAt: new Date(
                startsAt
              ).toISOString(),
              price: Number(price),
              screen,
            },
          ],
        }),
      });

      navigate("/movies/" + result._id);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section page-section admin-page">
      <span className="eyebrow">
        ADMIN DASHBOARD
      </span>

      <h1 className="page-title">
        Add <em>Movie</em>
      </h1>

      {/* Add Movie Form */}
      <form
        className="admin-form"
        onSubmit={submit}
      >
        {[
          ["title", "Movie title"],
          ["description", "Description"],
          ["genre", "Genre"],
          ["duration", "Duration (minutes)"],
          ["language", "Language"],
          ["rating", "Certification"],
          ["poster", "Poster image URL"],
          ["banner", "Banner image URL"],
          ["startsAt", "Show date and time"],
          ["price", "Ticket price (₹)"],
          ["screen", "Screen"],
        ].map(([key, label]) => (
          <label key={key}>
            {label}

            {key === "description" ? (
              <textarea
                required
                value={form[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]: e.target.value,
                  })
                }
              />
            ) : (
              <input
                required={
                  !["poster", "banner"].includes(
                    key
                  )
                }
                type={
                  key === "startsAt"
                    ? "datetime-local"
                    : ["duration", "price"].includes(
                        key
                      )
                    ? "number"
                    : "text"
                }
                min={
                  ["duration", "price"].includes(
                    key
                  )
                    ? 1
                    : undefined
                }
                value={form[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]: e.target.value,
                  })
                }
              />
            )}
          </label>
        ))}

        {/* Error Message */}
        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          className="btn"
          disabled={busy}
        >
          {busy ? "Saving…" : "Add Movie"}
        </button>
      </form>
    </section>
  );
}
