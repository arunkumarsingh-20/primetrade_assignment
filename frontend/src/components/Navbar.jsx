import { NavLink, Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const linkClass = ({ isActive }) =>
    `nav-link${isActive ? " nav-link--active" : ""}`;

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Link to={user ? "/dashboard" : "/login"} className="brand">
          <span className="brand__mark">T</span>
          <span className="brand__copy">
            <span className="brand__title">TaskPro</span>
            <span className="brand__subtitle">Simple task workspace</span>
          </span>
        </Link>

        <nav className="nav">
          {user ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <button onClick={onLogout} className="nav-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
