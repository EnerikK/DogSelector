import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-light bg-light shadow-sm">
      <div className="container">
        <div className="d-flex align-items-center gap-4">
          <NavLink to="/dogSelector" end
            className={({ isActive }) =>
              isActive
                ? "navbar-brand d-flex align-items-center fw-bold text-dark mb-0"
                : "navbar-brand d-flex align-items-center text-secondary mb-0"
            }
          >
            <i className="fas fa-paw me-2"></i>
            Dog Selector
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) =>
              isActive
                ? "nav-link fw-bold text-dark p-0"
                : "nav-link text-secondary p-0"
            }
          >
            Contact Us
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;