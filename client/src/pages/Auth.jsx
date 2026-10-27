
import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Clapperboard,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }) {
  const register = mode === "register";

  const { authenticate } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Handle Form Submission
  async function submit(e) {
    e.preventDefault();

    setBusy(true);
    setError("");

    try {
      await authenticate(mode, form);

      navigate(location.state?.from || "/movies", {
        replace: true,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-page">
      {/* Left Side Section */}
      <div className="auth-side">
        <Clapperboard size={48} />

        <h2>
          Your next great
          <br />
          <em>movie moment</em>
          <br />
          starts here.
        </h2>

        <p>
          All the stories you love.
          One place to book.
        </p>
      </div>

      {/* Right Side Authentication Panel */}
      <div className="auth-panel">
        <span className="eyebrow">
          WELCOME TO IMOVIES
        </span>

        <h1>
          {register
            ? "Create an account"
            : "Welcome back"}
        </h1>

        <p className="muted">
          {register
            ? "Join us and book your favorite movies."
            : "Log in to continue your movie journey."}
        </p>

        {/* Authentication Form */}
        <form onSubmit={submit}>
          {/* Full Name - Register Only */}
          {register && (
            <label>
              Full name

              <input
                required
                minLength="2"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Your name"
              />
            </label>
          )}

          {/* Email Address */}
          <label>
            Email address

            <input
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              placeholder="you@example.com"
            />
          </label>

          {/* Password */}
          <label>
            Password

            <input
              required
              type="password"
              minLength={register ? 8 : 1}
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              placeholder="Enter your password"
            />
          </label>

          {/* Error Message */}
          {error && (
            <p className="error">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            className="btn full"
            disabled={busy}
          >
            {busy
              ? "Please wait…"
              : register
              ? "Create Account"
              : "Login"}

            <ArrowRight size={18} />
          </button>
        </form>

        {/* Login / Register Navigation */}
        <p className="auth-switch">
          {register
            ? "Already have an account?"
            : "New to IMovies?"}{" "}

          <Link
            to={
              register
                ? "/login"
                : "/register"
            }
          >
            {register
              ? "Login"
              : "Create account"}
          </Link>
        </p>
      </div>
    </section>
  );
}
