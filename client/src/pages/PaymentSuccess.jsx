
import { Link } from 'react-router-dom';

export default function PaymentSuccess() {
  let payment = null;

  try {
    payment = JSON.parse(
      sessionStorage.getItem('demoPayment') || 'null'
    );
  } catch {
    payment = null;
  }

  if (!payment || payment.status !== 'DEMO_SUCCESS') {
    return (
      <section className="section page-section">
        <h2>No confirmed demo booking found.</h2>
        <Link to="/movies">Browse Movies</Link>
      </section>
    );
  }

  return (
    <section
      className="section page-section"
      style={{ textAlign: 'center' }}
    >
      <h1>Booking Confirmed!</h1>

      <p>Demo payment method: {payment.method}</p>
      <p>Displayed total: ₹{payment.amount}</p>

      <p>
        Your booking request was accepted by the server.
        No real payment was collected.
      </p>

      <Link to="/bookings" className="btn">
        View My Tickets
      </Link>
    </section>
  );
}
