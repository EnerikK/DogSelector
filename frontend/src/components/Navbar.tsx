import { NavLink } from "react-router-dom";
import { useAuth } from "./auth";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-light bg-light shadow-sm">
      <div className="container">
        <div className="d-flex align-items-center gap-4">
          <NavLink to="/dogs" end
            className={({ isActive }) =>
              isActive
                ? "navbar-brand d-flex align-items-center fw-bold text-dark mb-0"
                : "navbar-brand d-flex align-items-center text-secondary mb-0"
            }
          >
            <i className="fas fa-paw me-2"></i>
            Pawfect Match
          </NavLink>
          <NavLink to="/dogs" className={({ isActive }) =>
              isActive
                ? "nav-link fw-bold text-dark p-0"
                : "nav-link text-secondary p-0"
            }
          >
            Find Dogs
          </NavLink>
          {user ? (
            <>
              <NavLink to="/shelter/dashboard" className={({ isActive }) =>
                  isActive
                    ? "nav-link fw-bold text-dark p-0"
                    : "nav-link text-secondary p-0"
                }
              >
                Shelter Dashboard
              </NavLink>
              <button type="button" className="btn btn-link nav-link text-secondary p-0" onClick={() => void logout()}>
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/shelter/login" className={({ isActive }) =>
                isActive
                  ? "nav-link fw-bold text-dark p-0"
                  : "nav-link text-secondary p-0"
              }
            >
              Shelter Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
