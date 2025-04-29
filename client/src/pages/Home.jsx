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
      {/* Hero Section */}
      <section className="bg-primary text-white py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">SNS NDT Learning Platform</h1>
              <p className="lead mb-4">Expand your knowledge in Non-Destructive Testing with our expert instructors and comprehensive courses.</p>
              <Link to="/courses" className="btn btn-light btn-lg px-4 me-2">Explore Courses</Link>
              <Link to="/register" className="btn btn-outline-light btn-lg px-4">Sign Up</Link>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <img 
                src="https://mitech-ndt.co.id/wp-content/uploads/2021/02/Jenis-Pengujian-Non-Destructive-Test.jpg" 
                alt="NDT Learning" 
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5 bg-light mb-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="card border-0 bg-white shadow-sm h-100 py-4">
                <div className="card-body">
                  <div className="display-3 fw-bold text-primary mb-2">
                    {homeData.statistics.totalLectures}
                  </div>
                  <h4 className="text-uppercase">Total Courses</h4>
                  <p className="text-muted">Expert-led NDT training courses</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="card border-0 bg-white shadow-sm h-100 py-4">
                <div className="card-body">
                  <div className="display-3 fw-bold text-primary mb-2">
                    {homeData.statistics.totalCategories}
                  </div>
                  <h4 className="text-uppercase">Categories</h4>
                  <p className="text-muted">Specialized NDT disciplines</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 bg-white shadow-sm h-100 py-4">
                <div className="card-body">
                  <div className="display-3 fw-bold text-primary mb-2">
                    {homeData.statistics.totalUsers}
                  </div>
                  <h4 className="text-uppercase">Users</h4>
                  <p className="text-muted">Professional community members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-lg-8">
              <h2 className="fw-bold">Featured Courses</h2>
              <p className="lead text-muted">Our most popular NDT training options</p>
            </div>
            <div className="col-lg-4 d-flex justify-content-lg-end align-items-center">
              <Link to="/courses" className="btn btn-outline-primary">View All Courses</Link>
            </div>
          </div>
          
          <div className="row g-4">
            {homeData.featuredLectures.map((lecture) => (
              <div key={lecture.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm hover-shadow">
                  <img
                    src={lecture.image || "https://via.placeholder.com/300x200?text=NDT+Course"}
                    className="card-img-top"
                    alt={lecture.name}
                    height="200"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-secondary">{lecture.category?.name || "General"}</span>
                      <span className="text-primary fw-bold">{formatToIDR(lecture.price)}</span>
                    </div>
                    <h5 className="card-title">{lecture.name}</h5>
                    <p className="card-text text-muted mb-4">{lecture.technique}</p>
                    <div className="mt-auto">
                      <Link to={`/courses/${lecture.id}`} className="btn btn-primary d-block">View Details</Link>
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
