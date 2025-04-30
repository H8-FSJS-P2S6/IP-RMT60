import { Link } from "react-router"; // Perbaiki import dari "react-router" ke "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { FaHome, FaBook, FaTags, FaUser, FaShoppingCart, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
  
  return (
    <>
      <nav className={`navbar navbar-expand-lg ${scrolled ? 'navbar-light bg-light' : 'navbar-dark'} fixed-top transition-all duration-300`}
           style={{ 
             transition: 'all 0.3s ease',
             padding: scrolled ? '0.5rem 1rem' : '1rem',
             background: scrolled 
               ? 'rgba(255, 255, 255, 0.95)' 
               : 'linear-gradient(to right, #0062E6, #33AEFF)',
             borderBottom: scrolled 
               ? '1px solid #e5e5e5' 
               : '2px solid rgba(255, 255, 255, 0.2)'
           }}>
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <span className="me-2" style={{ 
              fontSize: '1.5rem',
              filter: scrolled ? 'drop-shadow(0 0 2px rgba(13, 110, 253, 0.4))' : 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.7))'
            }}>⚡</span>
            <span style={{ 
              background: scrolled ? 'linear-gradient(45deg, #0d6efd, #0dcaf0)' : 'transparent', 
              WebkitBackgroundClip: scrolled ? 'text' : 'unset', 
              WebkitTextFillColor: scrolled ? 'transparent' : 'inherit',
              transition: 'all 0.3s ease',
              fontWeight: '800',
              letterSpacing: '0.5px'
            }}>
              SAR NDT SERVICES
            </span>
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
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className={`nav-link d-flex align-items-center ${scrolled ? 'text-dark' : 'text-white'} mx-1`} to="/" 
                      style={{
                        position: 'relative',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = scrolled ? 'rgba(13, 110, 253, 0.1)' : 'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                  <FaHome className="me-1" /> <span>Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link d-flex align-items-center ${scrolled ? 'text-dark' : 'text-white'} mx-1`} to="/courses"
                      style={{
                        position: 'relative',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = scrolled ? 'rgba(13, 110, 253, 0.1)' : 'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                  <FaBook className="me-1" /> <span>Courses</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link d-flex align-items-center ${scrolled ? 'text-dark' : 'text-white'} mx-1`} to="/categories"
                      style={{
                        position: 'relative',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = scrolled ? 'rgba(13, 110, 253, 0.1)' : 'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                  <FaTags className="me-1" /> <span>Categories</span>
                </Link>
              </li>
            </ul>
            
            <ul className="navbar-nav ms-auto">
              {!isAuthenticated ? (
                <>
                  <li className="nav-item mx-1">
                    <Link className={`nav-link btn py-2 px-3 d-flex align-items-center ${scrolled ? 'btn-outline-primary' : 'btn-outline-light'}`} to="/login" 
                          style={{ 
                            borderRadius: '10px',
                            transition: 'all 0.3s ease',
                            boxShadow: scrolled ? '0 2px 5px rgba(13, 110, 253, 0.1)' : '0 2px 5px rgba(0, 0, 0, 0.2)'
                          }}>
                      <FaSignInAlt className="me-2" /> Login
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link btn btn-primary text-white py-2 px-3 d-flex align-items-center" to="/register" 
                          style={{ 
                            borderRadius: '10px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            boxShadow: scrolled ? '0 4px 8px rgba(13, 110, 253, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.3)',
                            background: scrolled ? 'linear-gradient(45deg, #0d6efd, #0dcaf0)' : 'rgba(255, 255, 255, 0.25)',
                            border: 'none'
                          }}>
                      <FaUserPlus className="me-2" /> Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <li className="nav-item mx-1">
                      <Link className="nav-link btn btn-warning py-2 px-3 d-flex align-items-center" to="/admin/dashboard"
                            style={{ 
                              borderRadius: '10px',
                              color: '#212529',
                              fontWeight: '500',
                              boxShadow: scrolled ? '0 4px 8px rgba(255, 193, 7, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.2)'
                            }}>
                        <FaTachometerAlt className="me-2" /> Admin Panel
                      </Link>
                    </li>
                  )}
                  <li className="nav-item dropdown ms-2">
                    <a
                      className="nav-link dropdown-toggle d-flex align-items-center"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{
                        backgroundColor: scrolled ? 'rgba(13, 110, 253, 0.1)' : 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '10px',
                        padding: '0.5rem 1.25rem',
                        boxShadow: scrolled ? '0 2px 5px rgba(13, 110, 253, 0.1)' : '0 2px 5px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <div className="user-avatar me-2" style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: scrolled ? 'linear-gradient(45deg, #0d6efd, #0dcaf0)' : '#fff',
                        color: scrolled ? '#fff' : '#0d6efd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        boxShadow: scrolled ? '0 2px 4px rgba(13, 110, 253, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}>
                        {user?.username?.charAt(0).toUpperCase() || <FaUser />}
                      </div>
                      <span className={scrolled ? 'text-dark' : 'text-white'}>{user?.username || "User"}</span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" 
                        style={{ 
                          borderRadius: '12px', 
                          marginTop: '12px',
                          overflow: 'hidden',
                          minWidth: '220px'
                        }} 
                        aria-labelledby="navbarDropdown">
                      <li style={{ 
                        padding: '1rem 1.25rem', 
                        fontWeight: 'bold', 
                        color: '#212529',
                        background: 'linear-gradient(45deg, #f8f9fa, #e9ecef)',
                        borderBottom: '1px solid #dee2e6'
                      }}>
                        <div className="d-flex align-items-center">
                          <div className="me-2" style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                          }}>
                            {user?.username?.charAt(0).toUpperCase() || <FaUser />}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600' }}>Hello, {user?.username || "User"}!</div>
                            <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Welcome back</div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2 d-flex align-items-center" to="/profile"
                              style={{ transition: 'background-color 0.2s ease' }}
                              onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#f8f9fa'}}
                              onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent'}}>
                          <FaUser className="me-2 text-primary" /> My Profile
                        </Link>
                      </li>
                      {!isAdmin && (
                        <li>
                          <Link className="dropdown-item py-2 d-flex align-items-center" to="/cart"
                                style={{ transition: 'background-color 0.2s ease' }}
                                onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#f8f9fa'}}
                                onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent'}}>
                            <FaShoppingCart className="me-2 text-primary" /> My Cart
                          </Link>
                        </li>
                      )}
                      <li><hr className="dropdown-divider m-1" /></li>
                      <li>
                        <button 
                          className="dropdown-item py-2 d-flex align-items-center" 
                          onClick={handleLogout}
                          style={{ 
                            color: '#dc3545',
                            transition: 'background-color 0.2s ease' 
                          }}
                          onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#f8d7da'}}
                          onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent'}}
                        >
                          <FaSignOutAlt className="me-2" /> Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      {/* Spacer to create gap between navbar and content */}
      <div className="navbar-spacer" style={{ 
        height: '70px', 
        width: '100%' 
      }}></div>
      {/* Additional decorative element to separate navbar from content */}
      <div className="navbar-accent" style={{ 
        height: '5px', 
        background: 'linear-gradient(90deg, #0062E6, #33AEFF, #0dcaf0)',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}></div>
    </>
  );
}