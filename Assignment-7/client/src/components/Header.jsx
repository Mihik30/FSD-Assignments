import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <div>
          <p className="eyebrow">Assignment 7</p>
          <h1 className="brand">PCCOE Event Review Portal</h1>
        </div>
        <nav className="top-nav" aria-label="Primary">
          <NavLink to="/" end>
            Submit Review
          </NavLink>
          <NavLink to="/admin">Admin Dashboard</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
