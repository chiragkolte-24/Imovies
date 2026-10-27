
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import SeatSelection from './pages/SeatSelection';
import Auth from './pages/Auth';
import Bookings from './pages/Bookings';
import Admin from './pages/Admin';

// New payment pages
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';

import './style.css';

function Guard({ children, admin = false }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return <main className="section">Loading…</main>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: loc.pathname }}
        replace
      />
    );
  }

  if (admin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />

          <Route
            path="/movies/:id/shows/:showId"
            element={<SeatSelection />}
          />

          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />

          <Route
            path="/bookings"
            element={
              <Guard>
                <Bookings />
              </Guard>
            }
          />

          <Route
            path="/admin"
            element={
              <Guard admin>
                <Admin />
              </Guard>
            }
          />

          {/* Demo payment routes */}
          <Route
            path="/payment"
            element={
              <Guard>
                <Payment />
              </Guard>
            }
          />

          <Route
            path="/payment-success"
            element={
              <Guard>
                <PaymentSuccess />
              </Guard>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        <span>🎬 <b>iMovies</b></span>
        <p>
          Made for movie lovers. © {new Date().getFullYear()} IMovies.
        </p>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
