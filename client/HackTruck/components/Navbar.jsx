import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light"
      style={{
        background: 'linear-gradient(135deg, #007bff, #0056b3)', // Gradient to match the theme
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '1rem 2rem',
      }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to="/"
          style={{ fontSize: '1.8rem', fontWeight: '700', color: '#fff' }}
        >
          HacTruck
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/login"
                style={{
                  fontSize: '1.2rem',
                  color: '#fff',
                  marginRight: '1rem',
                  fontWeight: '500',
                }}
              >
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/register"
                style={{ fontSize: '1.2rem', color: '#fff', fontWeight: '500' }}
              >
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;