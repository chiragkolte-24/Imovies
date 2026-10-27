
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Ticket } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const rows = 'ABCDEF'.split('');

export default function SeatSelection() {
  const { id, showId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [movie, setMovie] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');

  async function refresh() {
    const m = await api('/movies/' + id);
    setMovie(m);
    return m;
  }

  useEffect(() => {
    refresh().catch(e => setError(e.message));
  }, [id]);

  const show = movie?.shows?.find(s => s._id === showId);

  function toggle(seat) {
    setSelected(current =>
      current.includes(seat)
        ? current.filter(s => s !== seat)
        : current.length < 8
          ? [...current, seat]
          : current
    );
  }

  function proceedToPayment() {
    if (!user) {
      navigate('/login', {
        state: { from: location.pathname }
      });
      return;
    }

    if (!selected.length || !show) return;

    const unavailable = selected.some(
      seat => show.bookedSeats.includes(seat)
    );

    if (unavailable) {
      setError('Some selected seats are already booked.');
      return;
    }

    const bookingData = {
      movieId: id,
      movieTitle: movie.title,
      showId: showId,
      seats: selected,
      amount: selected.length * show.price,
      pricePerSeat: show.price,
      startsAt: show.startsAt,
      screen: show.screen
    };

    sessionStorage.setItem(
      'pendingBooking',
      JSON.stringify(bookingData)
    );

    navigate('/payment');
  }

  if (!movie) {
    return (
      <section className="section page-section">
        {error || 'Loading seats…'}
      </section>
    );
  }

  if (!show) {
    return (
      <section className="section page-section">
        Show not found.
      </section>
    );
  }

  return (
    <section className="section page-section seat-page">
      <Link to={'/movies/' + id} className="back-link">
        <ArrowLeft size={16} /> Back to showtimes
      </Link>

      <span className="eyebrow">CHOOSE YOUR SPOT</span>

      <h1 className="page-title">
        Select <em>Seats</em>
      </h1>

      <p className="muted">
        {movie.title} •{' '}
        {new Date(show.startsAt).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })}{' '}
        • {show.screen}
      </p>

      <div className="cinema">
        <div className="screen"></div>
        <p className="screen-label">SCREEN THIS WAY</p>

        <div className="seats">
          {rows.map(row => (
            <div className="seat-row" key={row}>
              <span className="row-label">{row}</span>

              {Array.from({ length: 8 }, (_, i) => {
                const seat = row + (i + 1);
                const taken = show.bookedSeats.includes(seat);

                return (
                  <button
                    key={seat}
                    title={seat}
                    aria-label={`Seat ${seat}${taken ? ' booked' : ''}`}
                    disabled={taken}
                    onClick={() => toggle(seat)}
                    className={
                      'seat ' +
                      (taken
                        ? 'taken'
                        : selected.includes(seat)
                          ? 'selected'
                          : '')
                    }
                  >
                    {i + 1}
                  </button>
                );
              })}

              <span className="row-label">{row}</span>
            </div>
          ))}
        </div>

        <div className="legend">
          <span><i className="legend-seat" /> Available</span>
          <span><i className="legend-seat chosen" /> Selected</span>
          <span><i className="legend-seat unavailable" /> Booked</span>
        </div>
      </div>

      <div className="booking-summary">
        <div>
          <small>SELECTED SEATS</small>
          <h3>{selected.join(', ') || 'None selected'}</h3>
        </div>

        <div>
          <small>TOTAL AMOUNT</small>
          <h2>₹{selected.length * show.price}</h2>
        </div>

        <button
          className="btn"
          onClick={proceedToPayment}
          disabled={!selected.length}
        >
          <Ticket size={18} />
          Proceed to Payment
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <p className="muted tiny">
        Demo checkout. Maximum 8 seats per booking.
        Seats are not reserved until booking confirmation.
      </p>
    </section>
  );
}
