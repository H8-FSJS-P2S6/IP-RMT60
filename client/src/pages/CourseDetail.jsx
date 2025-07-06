import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";
import { showToast } from '../utils/toast';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const { data } = await api.get(`/public/lectures/${id}`);
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError("Failed to load course details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      await api.post("/carts/add", { lectureId: id });
      showToast.success("Course added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast.error(error.response?.data?.message || "Failed to add course to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/courses" className="btn btn-primary">
          Back to Courses
        </Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5">
        <div className="alert alert-info" role="alert">
          Course not found
        </div>
        <Link to="/courses" className="btn btn-primary">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/courses">Courses</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {course.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-lg-8">
          <img
            src={course.image || "https://via.placeholder.com/800x450?text=Course+Cover"}
            alt={course.name}
            className="img-fluid rounded w-100 mb-4"
            style={{ maxHeight: "450px", objectFit: "cover" }}
          />
          
          <h1 className="mb-3">{course.name}</h1>
          
          <div className="mb-4">
            <span className="badge bg-secondary me-2">{course.category?.name}</span>
            <span className="me-3">
              <i className="bi bi-person-fill me-1"></i> {course.instructor || "Expert Instructor"}
            </span>
            <span>
              <i className="bi bi-clock-fill me-1"></i> {course.duration || "Self-paced"}
            </span>
          </div>
          
          <div className="mb-4">
            <h4>Description</h4>
            <p>{course.description || "No description available for this course."}</p>
          </div>
          
          <div className="mb-4">
            <h4>What You'll Learn</h4>
            <div className="row">
              <div className="col-md-6">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Understanding of {course.technique} principles
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Practical application skills
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Industry standard procedures
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Safety protocols and best practices
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Equipment handling and maintenance
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    Certification preparation
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4>Course Details</h4>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Technique:</strong> {course.technique}</p>
                <p><strong>Experience Required:</strong> {course.experience_years} years</p>
              </div>
              <div className="col-md-6">
                <p><strong>Level:</strong> {course.level || "All Levels"}</p>
                <p><strong>Language:</strong> {course.language || "English"}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-lg-top" style={{ top: "2rem" }}>
            <div className="card-body">
              <h3 className="text-primary fw-bold mb-3">{formatToIDR(course.price)}</h3>
              
              <button 
                className="btn btn-primary w-100 py-2 mb-3"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </>
                )}
              </button>
              
              <p className="text-center mb-3">or</p>
              
              <button className="btn btn-outline-primary w-100 py-2 mb-4">
                <i className="bi bi-lightning-fill me-2"></i>
                Buy Now
              </button>
              
              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>This course includes:</span>
              </div>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-play-circle me-2"></i> On-demand video
                </li>
                <li className="mb-2">
                  <i className="bi bi-file-earmark-text me-2"></i> Downloadable resources
                </li>
                <li className="mb-2">
                  <i className="bi bi-trophy me-2"></i> Certificate of completion
                </li>
                <li className="mb-2">
                  <i className="bi bi-laptop me-2"></i> Full lifetime access
                </li>
                <li className="mb-2">
                  <i className="bi bi-phone me-2"></i> Access on mobile and TV
                </li>
              </ul>
              
              <hr className="my-4" />
              
              <div className="text-center">
                <p className="mb-0 small">Have questions?</p>
                <a href="#" className="text-decoration-none">Contact instructor</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}