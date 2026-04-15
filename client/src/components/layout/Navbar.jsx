import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link to="/" className="brand-mark">
          <span>Aurora</span>
          <span>Stay</span>
        </Link>

        <nav className="main-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/rooms">Rooms</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link className="ghost-button" to={user.role === 'admin' ? '/admin' : '/my-bookings'}>
                {user.role === 'admin' ? 'Admin' : 'My Bookings'}
              </Link>
              <button className="primary-button" onClick={handleLogout} type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="ghost-button" to="/login">
                Login
              </Link>
              <Link className="primary-button" to="/booking">
                Book Now
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
