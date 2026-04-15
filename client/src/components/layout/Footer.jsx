import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-grid">
      <div>
        <h3>Aurora Stay</h3>
        <p>Designed for guests who want calm luxury, layered comfort, and a seamless booking experience.</p>
      </div>
      <div>
        <h4>Explore</h4>
        <Link to="/rooms">Rooms</Link>
        <Link to="/about">About</Link>
        <Link to="/gallery">Gallery</Link>
      </div>
      <div>
        <h4>Guest Journey</h4>
        <Link to="/booking">Book a Stay</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/my-bookings">My Bookings</Link>
      </div>
      <div>
        <h4>Contact</h4>
        <p>18 Skyline Avenue, Bengaluru</p>
        <p>hello@aurorastay.com</p>
        <p>+91 98765 43210</p>
      </div>
    </div>
  </footer>
);

export default Footer;
