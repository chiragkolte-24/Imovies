
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Ticket, CalendarDays } from "lucide-react";
import { api } from "../api";

export default function Bookings() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const location = useLocation();

  // Fetch user's bookings
  async function load() {
    try {
      setItems(await api("/bookings/mine"));
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Cancel a booking
  async function cancel(id) {
    if (!window.confirm("Cancel this booking?")) {
      return;
    }

    try {
      await api("/bookings/" + id + "/cancel", {
        method: "PATCH",
      });

      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section className="section page-section">
      <span className="eyebrow">
        YOUR CINEMA JOURNEY
      </span>

      <h1 className="page-title">
        My <em>Bookings</em>
      </h1>

      {/* Booking Success Message */}
      {location.state?.success && (
        <p className="success">
          {location.state.success}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {/* Empty Bookings Section */}
      {!items.length && (
        <div className="empty-state">
          <Ticket size={42} />

          <h2>No bookings yet</h2>

          <p>
            Ready for your next movie night?
          </p>

          <Link
            className="btn"
            to="/movies"
          >
            Browse Movies
          </Link>
        </div>
      )}

      {/* Bookings List */}
      <div className="bookings-list">
        {items.map((b) => (
          <div
            className="booking-card"
            key={b._id}
          >
            {/* Movie Poster */}
            <img
              src={b.movie?.poster}
              alt=""
            />

            <div className="booking-body">
              {/* Booking Header */}
              <div className="booking-top">
                <h3>
                  {b.movie?.title ||
                    "Movie unavailable"}
                </h3>

                <span
                  className={"status " + b.status}
                >
                  {b.status}
                </span>
              </div>

              {/* Show Date and Time */}
              <p>
                <CalendarDays size={15} />

                {new Date(
                  b.startsAt
                ).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              {/* Screen and Seats */}
              <p>
                {b.screen} • Seats:{" "}
                <strong>
                  {b.seats.join(", ")}
                </strong>
              </p>

              {/* Booking Footer */}
              <div className="booking-bottom">
                <strong>
                  ₹{b.total}
                </strong>

                {b.status === "confirmed" &&
                  new Date(b.startsAt) >
                    new Date() && (
                    <button
                      className="text-button danger"
                      onClick={() =>
                        cancel(b._id)
                      }
                    >
                      Cancel booking
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
