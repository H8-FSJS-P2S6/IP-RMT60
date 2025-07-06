import { useState, useEffect } from "react";
import api from "../utils/api";
import { Link } from "react-router"; 

export default function Home() {
  // Helper function untuk format IDR
  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data } = await api.get("/public/homepage-bundle");
        setHomeData(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
        setError("Failed to load homepage data. Please try again later.");
        // Set default data structure to prevent rendering errors
        setHomeData({
          featuredLectures: [],
          latestLectures: [],
          popularCategories: [],
          statistics: {
            totalLectures: 0,
            totalCategories: 0,
            totalUsers: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (error) return (
    <div className="alert alert-danger m-5" role="alert">
      {error}
    </div>
  );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div>
      {/* Ultra Modern Hero Section */}
      <section className="hero-modern text-white position-relative overflow-hidden">
        {/* Floating Elements */}
        <div className="hero-floating-elements">
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
          <div className="floating-shape"></div>
        </div>
        
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6 hero-content animate-slide-up">
              <div className="mb-4">
                <span className="badge badge-modern d-inline-flex align-items-center mb-4" 
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '50px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}>
                  <i className="bi bi-award-fill me-2"></i>
                  #1 NDT Learning Platform
                </span>
              </div>
              
              <h1 className="display-2 fw-black mb-4" 
                  style={{
                    fontSize: '4.5rem',
                    fontWeight: '900',
                    lineHeight: '1.1',
                    letterSpacing: '-0.02em'
                  }}>
                Master the Future of{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  NDT Technology
                </span>
              </h1>
              
              <p className="lead mb-5" style={{ 
                fontSize: '1.4rem', 
                lineHeight: '1.6',
                opacity: '0.9',
                fontWeight: '400',
                maxWidth: '500px'
              }}>
                Transform your career with industry-leading Non-Destructive Testing courses. 
                Learn from certified experts and master cutting-edge inspection techniques.
              </p>
              
              <div className="d-flex flex-column flex-sm-row gap-4 mb-6">
                <Link to="/courses" className="btn btn-gradient btn-lg d-flex align-items-center justify-content-center"
                      style={{
                        padding: '18px 32px',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        borderRadius: '16px',
                        minWidth: '200px'
                      }}>
                  <i className="bi bi-play-circle-fill me-2 fs-5"></i>
                  Start Learning Now
                </Link>
                <Link to="/categories" className="btn btn-glass btn-lg d-flex align-items-center justify-content-center"
                      style={{
                        padding: '18px 32px',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        borderRadius: '16px',
                        minWidth: '200px'
                      }}>
                  <i className="bi bi-collection me-2 fs-5"></i>
                  Explore Courses
                </Link>
              </div>

              {/* Enhanced Stats Row */}
              <div className="row text-center text-sm-start g-4">
                <div className="col-sm-4">
                  <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
                    <div className="me-3 rounded-circle d-flex align-items-center justify-content-center"
                         style={{
                           width: '50px',
                           height: '50px',
                           background: 'rgba(255, 255, 255, 0.2)',
                           backdropFilter: 'blur(10px)'
                         }}>
                      <i className="bi bi-people-fill fs-4"></i>
                    </div>
                    <div>
                      <div className="fw-bold fs-4">{homeData.statistics.totalUsers || 1500}+</div>
                      <small className="opacity-75">Active Students</small>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
                    <div className="me-3 rounded-circle d-flex align-items-center justify-content-center"
                         style={{
                           width: '50px',
                           height: '50px',
                           background: 'rgba(255, 255, 255, 0.2)',
                           backdropFilter: 'blur(10px)'
                         }}>
                      <i className="bi bi-book-fill fs-4"></i>
                    </div>
                    <div>
                      <div className="fw-bold fs-4">{homeData.statistics.totalLectures || 50}+</div>
                      <small className="opacity-75">Expert Courses</small>
                    </div>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
                    <div className="me-3 rounded-circle d-flex align-items-center justify-content-center"
                         style={{
                           width: '50px',
                           height: '50px',
                           background: 'rgba(255, 255, 255, 0.2)',
                           backdropFilter: 'blur(10px)'
                         }}>
                      <i className="bi bi-award-fill fs-4"></i>
                    </div>
                    <div>
                      <div className="fw-bold fs-4">100%</div>
                      <small className="opacity-75">Certified</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 d-none d-lg-block animate-fade-scale">
              <div className="position-relative">
                <div className="card-glass p-5 rounded-4 position-relative"
                     style={{
                       transform: 'perspective(1000px) rotateY(-15deg) rotateX(5deg)',
                       backdropFilter: 'blur(20px)'
                     }}>
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Advanced NDT Technology" 
                    className="img-fluid rounded-3 shadow-lg"
                    style={{ 
                      borderRadius: '20px',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
                    }}
                  />
                  
                  {/* Floating Achievement Cards */}
                  <div className="position-absolute top-0 start-0 card-glass p-3 rounded-3 shadow-lg float" 
                       style={{ 
                         transform: 'translate(-30px, 30px)',
                         animation: 'float 3s ease-in-out infinite',
                         maxWidth: '180px'
                       }}>
                    <div className="d-flex align-items-center">
                      <div className="me-3 rounded-circle d-flex align-items-center justify-content-center"
                           style={{
                             width: '40px',
                             height: '40px',
                             background: 'linear-gradient(135deg, #10b981, #059669)'
                           }}>
                        <i className="bi bi-check-circle-fill text-white"></i>
                      </div>
                      <div>
                        <div className="fw-bold text-white small">Expert Certified</div>
                        <div className="text-white-50" style={{ fontSize: '0.75rem' }}>Industry Leaders</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="position-absolute bottom-0 end-0 card-glass p-3 rounded-3 shadow-lg" 
                       style={{ 
                         transform: 'translate(30px, -30px)',
                         animation: 'float 3s ease-in-out infinite 1.5s',
                         maxWidth: '180px'
                       }}>
                    <div className="d-flex align-items-center">
                      <div className="me-3 rounded-circle d-flex align-items-center justify-content-center"
                           style={{
                             width: '40px',
                             height: '40px',
                             background: 'linear-gradient(135deg, #f59e0b, #d97706)'
                           }}>
                        <i className="bi bi-trophy-fill text-white"></i>
                      </div>
                      <div>
                        <div className="fw-bold text-white small">Industry Recognition</div>
                        <div className="text-white-50" style={{ fontSize: '0.75rem' }}>Global Standards</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-title">Trusted by Industry Professionals</h2>
              <p className="section-subtitle">Join thousands of professionals advancing their NDT expertise</p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-3">
              <div className="stats-card h-100">
                <div className="position-relative mb-3">
                  <div className="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-journal-richtext fs-3 text-white"></i>
                  </div>
                </div>
                <div className="stats-number">{homeData.statistics.totalLectures}</div>
                <h4 className="fw-bold mb-2">Expert Courses</h4>
                <p className="text-muted mb-0">Comprehensive NDT training programs designed by industry experts</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="stats-card h-100">
                <div className="position-relative mb-3">
                  <div className="bg-gradient-secondary rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-grid-3x3-gap fs-3 text-white"></i>
                  </div>
                </div>
                <div className="stats-number">{homeData.statistics.totalCategories}</div>
                <h4 className="fw-bold mb-2">NDT Disciplines</h4>
                <p className="text-muted mb-0">Specialized training across all major NDT methodologies</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="stats-card h-100">
                <div className="position-relative mb-3">
                  <div className="bg-gradient-accent rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-people fs-3 text-white"></i>
                  </div>
                </div>
                <div className="stats-number">{homeData.statistics.totalUsers}</div>
                <h4 className="fw-bold mb-2">Active Learners</h4>
                <p className="text-muted mb-0">Professional community members advancing their careers</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="stats-card h-100">
                <div className="position-relative mb-3">
                  <div className="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-award fs-3 text-white"></i>
                  </div>
                </div>
                <div className="stats-number">100%</div>
                <h4 className="fw-bold mb-2">Certification</h4>
                <p className="text-muted mb-0">Industry-recognized certificates upon course completion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className="section-padding bg-light">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12 text-center">
              <h2 className="section-title">Trusted by Industry Professionals</h2>
              <p className="section-subtitle">Join thousands of professionals advancing their NDT expertise</p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-3">
              <div className="stats-card h-100">
                <div className="position-relative mb-3">
                  <div className="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-journal-richtext fs-3 text-white"></i>
                  </div>
                </div>
                <div className="stats-number">{homeData.statistics.totalLectures}</div>
                <h4 className="fw-bold mb-2">Expert Courses</h4>
                <p className="text-muted mb-0">Comprehensive NDT training programs designed by industry experts</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="stats-card h-100">
                <div className="position-relative mb-3">
                  <div className="bg-gradient-secondary rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-grid-3x3-gap fs-3 text-white"></i>
                  </div>
                </div>
                <div className="stats-number">{homeData.statistics.totalCategories}</div>
                <h4 className="fw-bold mb-2">NDT Disciplines</h4>
                <p className="text-muted mb-0">Specialized training across all major NDT methodologies</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="stats-card h-100">
                <div className="position-relative mb-3">
                  <div className="bg-gradient-accent rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-people fs-3 text-white"></i>
                  </div>
                </div>
                <div className="stats-number">{homeData.statistics.totalUsers}</div>
                <h4 className="fw-bold mb-2">Active Learners</h4>
                <p className="text-muted mb-0">Professional community members advancing their careers</p>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="stats-card h-100">
                <div className="position-relative mb-3">
                  <div className="bg-gradient-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-award fs-3 text-white"></i>
                  </div>
                </div>
                <div className="stats-number">100%</div>
                <h4 className="fw-bold mb-2">Certification</h4>
                <p className="text-muted mb-0">Industry-recognized certificates upon course completion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="section-padding">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8">
              <h2 className="section-title">Featured Courses</h2>
              <p className="section-subtitle">Master cutting-edge NDT techniques with our industry-leading courses</p>
            </div>
            <div className="col-lg-4 d-flex justify-content-lg-end align-items-center">
              <Link to="/courses" className="btn btn-outline-primary btn-lg">
                <i className="bi bi-arrow-right me-2"></i>
                View All Courses
              </Link>
            </div>
          </div>
          
          <div className="row g-4">
            {homeData.featuredLectures.map((lecture, index) => (
              <div key={lecture.id} className="col-md-6 col-lg-4">
                <div className="card-course position-relative">
                  <div className="position-relative overflow-hidden">
                    <img
                      src={lecture.image || "https://via.placeholder.com/320x180?text=NDT+Course&bg=2C3E50&color=ffffff"}
                      className="card-img-top"
                      alt={lecture.name}
                    />
                    <div className="position-absolute top-0 start-0 m-3">
                      {index === 0 && <span className="badge bg-danger">Popular</span>}
                      {index === 1 && <span className="badge bg-success">New</span>}
                      {index === 2 && <span className="badge bg-warning text-dark">Trending</span>}
                    </div>
                    <div className="position-absolute bottom-0 end-0 m-3">
                      <span className="badge badge-modern">
                        {lecture.category?.name || "General"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <div className="bg-gradient-primary rounded-circle p-1 me-2" style={{ width: '24px', height: '24px' }}>
                          <i className="bi bi-star-fill text-white" style={{ fontSize: '0.75rem' }}></i>
                        </div>
                        <small className="text-muted">4.8 (120 reviews)</small>
                      </div>
                      <span className="text-primary fw-bold fs-5">{formatToIDR(lecture.price)}</span>
                    </div>
                    
                    <h5 className="card-title mb-2" style={{ 
                      fontSize: '1.1rem', 
                      lineHeight: '1.3',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {lecture.name}
                    </h5>
                    
                    <p className="card-text text-muted mb-3" style={{ 
                      fontSize: '0.9rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {lecture.technique}
                    </p>
                    
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-clock me-1"></i>
                        <small>Self-paced</small>
                      </div>
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-people me-1"></i>
                        <small>{Math.floor(Math.random() * 100) + 50} students</small>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <Link to={`/courses/${lecture.id}`} className="btn btn-primary w-100 fw-semibold">
                        <i className="bi bi-play-circle me-2"></i>
                        Start Learning
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Courses */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <h2 className="fw-bold">Latest Courses</h2>
              <p className="lead text-muted">Recently added to our platform</p>
            </div>
          </div>
          
          <div className="row g-4">
            {homeData.latestLectures && homeData.latestLectures.slice(0, 3).map((lecture) => (
              <div key={lecture.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm hover-shadow">
                  <div className="position-relative">
                    <img
                      src={lecture.image || "https://via.placeholder.com/300x200?text=NDT+Course"}
                      className="card-img-top"
                      alt={lecture.name}
                      height="200"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="position-absolute top-0 start-0 m-3">
                      <span className="badge bg-success">New</span>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-secondary">{lecture.category?.name || "General"}</span>
                      <span className="text-primary fw-bold">{formatToIDR(lecture.price)}</span>
                    </div>
                    <h5 className="card-title">{lecture.name}</h5>
                    <p className="card-text text-muted mb-4">{lecture.technique}</p>
                    <div className="mt-auto">
                      <Link to={`/courses/${lecture.id}`} className="btn btn-outline-primary d-block">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <h2 className="fw-bold">Explore Categories</h2>
              <p className="lead text-muted">Browse our comprehensive NDT training disciplines</p>
            </div>
          </div>
          
          <div className="row g-4">
            {homeData.popularCategories.map((category) => (
              <div key={category.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 bg-light shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <h4 className="card-title">{category.name}</h4>
                    <p className="card-text flex-grow-1">{category.description || "Explore our comprehensive courses in this category."}</p>
                    <Link to={`/categories/${category.id}`} className="btn btn-outline-primary mt-3">
                      Browse Courses
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-5">
            <Link to="/categories" className="btn btn-primary btn-lg">View All Categories</Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-primary text-white text-center">
        <div className="container">
          <h2 className="fw-bold mb-3">Ready to Start Your NDT Learning Journey?</h2>
          <p className="lead mb-4">Join our community of professionals and enhance your skills with expert-led training.</p>
          <Link to="/register" className="btn btn-light btn-lg me-2">Sign Up Now</Link>
          <Link to="/courses" className="btn btn-outline-light btn-lg">Browse Courses</Link>
        </div>
      </section>
    </div>
  );
}
