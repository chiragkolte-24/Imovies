
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Payment() {
  const navigate = useNavigate();

  const [method, setMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [booking] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem('pendingBooking') || 'null'
      );
    } catch {
      return null;
    }
  });

  async function handlePayment() {
    if (!booking || processing) return;

    setProcessing(true);
    setError('');

    try {
      // Demo only: no real payment transaction occurs.
      // Existing backend must validate the booking.
      const result = await api('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          movieId: booking.movieId,
          showId: booking.showId,
          seats: booking.seats
        })
      });

      sessionStorage.setItem(
        'demoPayment',
        JSON.stringify({
          method,
          status: 'DEMO_SUCCESS',
          amount: booking.amount,
          bookingResult: result
        })
      );

      sessionStorage.removeItem('pendingBooking');

      navigate('/payment-success', { replace: true });

    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  if (!booking) {
    return (
      <section className="section page-section">
        <h2>No pending booking found.</h2>
        <Link to="/movies" className="btn">
          Browse Movies
        </Link>
      </section>
    );
  }

  return (
    <section className="section page-section">
      <div style={{
        maxWidth: 480,
        margin: '30px auto',
        padding: 28,
        borderRadius: 16,
        background: '#181818',
        color: '#fff'
      }}>
        <h1>IMovies Payment</h1>

        <p>Movie: <b>{booking.movieTitle}</b></p>
        <p>Seats: <b>{booking.seats.join(', ')}</b></p>
        <p>Screen: {booking.screen}</p>

        <h2>Total: ₹{booking.amount}</h2>

        <hr />

        <h3>Select Payment Method</h3>

        {['UPI', 'Card', 'Net Banking', 'Pay at Counter'].map(item => (
          <label
            key={item}
            style={{ display: 'block', margin: '16px 0' }}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={method === item}
              onChange={() => setMethod(item)}
            />
            {' '}{item} (Demo)
          </label>
        ))}

        {error && <p className="error">{error}</p>}

        <button
          className="btn"
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={processing}
          onClick={handlePayment}
        >
          {processing
            ? 'Confirming booking…'
            : `Confirm Demo Payment — ₹${booking.amount}`}
        </button>

        <p className="muted tiny" style={{ marginTop: 16 }}>
          Demo payment only. No money is collected.
          Ticket confirmation depends on the booking server.
        </p>
      </div>
    </section>
  );
}
