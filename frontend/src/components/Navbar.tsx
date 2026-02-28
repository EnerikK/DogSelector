import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
        <i className="fas fa-paw me-2"></i>
          Dog Selector
        </Link>

        <div className="navbar-nav ms-auto">
          <Link className="nav-link" to="/">
            Dog Selector
          </Link>
          <Link className="nav-link" to="/contact">
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;