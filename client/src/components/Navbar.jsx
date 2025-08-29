import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { FaGraduationCap, FaBook, FaTags, FaUser, FaShoppingCart, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt, FaBell, FaSearch, FaPlay } from 'react-icons/fa';

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
    // Use setTimeout to prevent navigation throttling
    setTimeout(() => {
      window.location.href = "/login";
    }, 100);
  };
  
  return (
    <>
      {/* Top notification bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <FaBell className="me-2" />
              <span className="small">🎉 New courses available! Start your NDT journey today.</span>
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="small d-none d-md-inline">📞 Support: +62 21 1234 5678</span>
              <span className="small">✨ Free trial available</span>
            </div>
          </div>
        </div>
      </div>

      <nav className={`navbar navbar-expand-lg ${scrolled ? 'navbar-light bg-white' : 'navbar-dark'} sticky-top shadow-lg`}
           style={{ 
             transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
             padding: '1rem 0',
             borderBottom: scrolled ? '3px solid #3498DB' : 'none',
             backdropFilter: 'blur(20px)',
             background: scrolled 
               ? 'rgba(255, 255, 255, 0.98)' 
               : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
             zIndex: 1050
           }}>
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" 
                style={{ transform: scrolled ? 'scale(0.95)' : 'scale(1)', transition: 'transform 0.3s ease' }}>
            <div className="me-3 d-flex align-items-center justify-content-center rounded-3 shadow-lg"
                 style={{ 
                   width: '50px', 
                   height: '50px',
                   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                   transform: 'rotate(-5deg)',
                   transition: 'all 0.3s ease'
                 }}>
              <FaGraduationCap className="fs-4 text-white" style={{ transform: 'rotate(5deg)' }} />
            </div>
            <div>
              <div style={{ 
                fontSize: '1.75rem',
                fontWeight: '900',
                letterSpacing: '-1px',
                background: scrolled ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: scrolled ? 'transparent' : 'white',
                transition: 'all 0.3s ease',
                lineHeight: '1'
              }}>
                EduCraft
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: scrolled ? '#6b7280' : 'rgba(255,255,255,0.8)',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}>
                NDT Learning Platform
              </div>
            </div>
          </Link>
          
          {/* Search Bar - Center */}
          <div className="d-none d-lg-flex flex-grow-1 justify-content-center mx-5">
            <div className="position-relative" style={{ maxWidth: '400px', width: '100%' }}>
              <input 
                type="text" 
                className="form-control rounded-pill ps-5 pe-4 border-0 shadow-sm"
                placeholder="Search courses, categories..."
                style={{
                  background: scrolled ? '#f8f9fa' : 'rgba(255,255,255,0.9)',
                  color: '#2c3e50',
                  height: '45px',
                  fontSize: '0.95rem'
                }}
              />
              <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            </div>
          </div>

          <button
            className="navbar-toggler border-0 rounded-3 shadow-sm"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{
              background: scrolled ? '#f8f9fa' : 'rgba(255,255,255,0.2)',
              padding: '0.75rem 1rem'
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Mobile Search */}
            <div className="d-lg-none my-3">
              <div className="position-relative">
                <input 
                  type="text" 
                  className="form-control rounded-pill ps-5 pe-4 border-0"
                  placeholder="Search courses..."
                  style={{
                    background: scrolled ? '#f8f9fa' : 'rgba(255,255,255,0.9)',
                    color: '#2c3e50'
                  }}
                />
                <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              </div>
            </div>

            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className={`nav-link d-flex align-items-center fw-semibold position-relative ${scrolled ? 'text-dark' : 'text-white'} mx-2`} 
                      to="/"
                      style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: '15px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: 'transparent'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = scrolled 
                          ? 'linear-gradient(135deg, #667eea20, #764ba220)' 
                          : 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}>
                  <FaGraduationCap className="me-2" />
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link d-flex align-items-center fw-semibold ${scrolled ? 'text-dark' : 'text-white'} mx-2`} 
                      to="/courses"
                      style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: '15px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = scrolled 
                          ? 'linear-gradient(135deg, #667eea20, #764ba220)' 
                          : 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}>
                  <FaPlay className="me-2" />
                  Courses
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link d-flex align-items-center fw-semibold ${scrolled ? 'text-dark' : 'text-white'} mx-2`} 
                      to="/categories"
                      style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: '15px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = scrolled 
                          ? 'linear-gradient(135deg, #667eea20, #764ba220)' 
                          : 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}>
                  <FaTags className="me-2" />
                  Categories
                </Link>
              </li>
            </ul>
            
            <ul className="navbar-nav ms-auto align-items-lg-center">
              {!isAuthenticated ? (
                <>
                  <li className="nav-item mx-1">
                    <Link className="nav-link btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold d-flex align-items-center justify-content-center" 
                          to="/login"
                          style={{ 
                            borderWidth: '2px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            background: 'transparent'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = scrolled ? '#667eea' : 'white';
                            e.currentTarget.style.color = scrolled ? 'white' : '#667eea';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(102, 126, 234, 0.3)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = scrolled ? '#667eea' : 'white';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                      <FaSignInAlt className="me-2" />
                      Sign In
                    </Link>
                  </li>
                  <li className="nav-item mx-1">
                    <Link className="nav-link btn rounded-pill px-4 py-2 fw-semibold d-flex align-items-center justify-content-center text-white" 
                          to="/register"
                          style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                          }}>
                      <FaUserPlus className="me-2" />
                      Get Started
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <li className="nav-item mx-1">
                      <Link className="nav-link btn btn-warning rounded-pill px-4 py-2 fw-semibold d-flex align-items-center justify-content-center" 
                            to="/admin/dashboard"
                            style={{ 
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
                              border: 'none',
                              color: 'white'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.4)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}>
                        <FaTachometerAlt className="me-2" />
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  
                  {/* Notification Bell */}
                  <li className="nav-item mx-2">
                    <button className="btn btn-link position-relative p-2"
                            style={{
                              color: scrolled ? '#667eea' : 'white',
                              fontSize: '1.2rem',
                              border: 'none'
                            }}>
                      <FaBell />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                            style={{ fontSize: '0.6rem' }}>
                        3
                      </span>
                    </button>
                  </li>
                  
                  <li className="nav-item dropdown mx-1">
                    <a className={`nav-link dropdown-toggle d-flex align-items-center fw-semibold rounded-pill px-3 py-2 ${
                      scrolled ? 'text-dark' : 'text-white'
                    }`}
                       href="#" 
                       id="navbarDropdown" 
                       role="button" 
                       data-bs-toggle="dropdown" 
                       aria-expanded="false"
                       style={{
                         transition: 'all 0.3s ease',
                         background: scrolled ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                         backdropFilter: 'blur(10px)'
                       }}>
                      <div className="me-2 rounded-circle d-flex align-items-center justify-content-center"
                           style={{
                             width: '35px',
                             height: '35px',
                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                             color: 'white',
                             fontSize: '0.9rem',
                             fontWeight: 'bold'
                           }}>
                        {user?.username?.charAt(0).toUpperCase() || <FaUser />}
                      </div>
                      <span className="d-none d-md-inline">{user?.username || "User"}</span>
                    </a>
                    
                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" 
                        style={{ 
                          borderRadius: '20px', 
                          marginTop: '0.5rem',
                          overflow: 'hidden',
                          minWidth: '280px',
                          background: 'white',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                        }}>
                      <li style={{ 
                        padding: '1.5rem 1.5rem 1rem', 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                      }}>
                        <div className="d-flex align-items-center">
                          <div className="me-3 rounded-circle d-flex align-items-center justify-content-center"
                               style={{
                                 width: '50px',
                                 height: '50px',
                                 background: 'rgba(255,255,255,0.2)',
                                 color: 'white',
                                 fontWeight: 'bold',
                                 fontSize: '1.2rem'
                               }}>
                            {user?.username?.charAt(0).toUpperCase() || <FaUser />}
                          </div>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                              {user?.username || "User"}
                            </div>
                            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                              {user?.email || "user@example.com"}
                            </div>
                          </div>
                        </div>
                      </li>
                      
                      <li>
                        <Link className="dropdown-item py-3 px-4 d-flex align-items-center" 
                              to="/profile"
                              style={{ 
                                transition: 'all 0.2s ease',
                                fontWeight: '500',
                                fontSize: '0.95rem'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(135deg, #667eea10, #764ba210)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'transparent';
                              }}>
                          <FaUser className="me-3 text-primary" style={{ fontSize: '1.1rem' }} />
                          My Profile
                        </Link>
                      </li>
                      
                      {!isAdmin && (
                        <li>
                          <Link className="dropdown-item py-3 px-4 d-flex align-items-center" 
                                to="/cart"
                                style={{ 
                                  transition: 'all 0.2s ease',
                                  fontWeight: '500',
                                  fontSize: '0.95rem'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.background = 'linear-gradient(135deg, #667eea10, #764ba210)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                }}>
                            <FaShoppingCart className="me-3 text-primary" style={{ fontSize: '1.1rem' }} />
                            My Cart
                          </Link>
                        </li>
                      )}
                      
                      <li><hr className="dropdown-divider mx-3 my-2" style={{ borderColor: '#e5e7eb' }} /></li>
                      
                      <li>
                        <button 
                          className="dropdown-item py-3 px-4 d-flex align-items-center w-100" 
                          onClick={handleLogout}
                          style={{ 
                            color: '#ef4444',
                            transition: 'all 0.2s ease',
                            fontWeight: '500',
                            border: 'none',
                            background: 'none',
                            fontSize: '0.95rem'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}>
                          <FaSignOutAlt className="me-3" style={{ fontSize: '1.1rem' }} />
                          Sign Out
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
      
      {/* Spacer untuk sticky navbar */}
      <div style={{ height: '90px' }}></div>
    </>
  );
}