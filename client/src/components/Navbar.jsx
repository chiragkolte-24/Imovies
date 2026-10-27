
import {
  Link,
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  Clapperboard,
  Ticket,
  LogOut,
  UserRound,
  PlusCircle
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="nav">
      {/* Website Logo */}
      <Link className="brand" to="/">
        <Clapperboard size={26} />

        <span>
          i<span className="red">Movies</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <nav>
        <NavLink to="/">Home</NavLink>

        <NavLink to="/movies">Movies</NavLink>

        {user && (
          <NavLink to="/bookings">
            <Ticket size={16} />
            My Bookings
          </NavLink>
        )}

        {user?.role === "admin" && (
          <NavLink to="/admin">
            <PlusCircle size={16} />
            Add Movie
          </NavLink>
        )}
      </nav>

      {/* Right Side Navigation */}
      <div className="nav-right">
        {user ? (
          <>
            <span className="greeting">
              <UserRound size={15} />
              {user.name?.split(" ")[0]}
            </span>

            <button
              className="text-button"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="text-button" to="/login">
              Login
            </Link>

            <Link className="btn btn-small" to="/register">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}


