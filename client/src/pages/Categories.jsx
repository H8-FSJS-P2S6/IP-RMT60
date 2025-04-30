import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../utils/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/public/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search term
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-lg-8">
          <h1 className="mb-2">Course Categories</h1>
          <p className="lead text-muted">
            Browse our comprehensive NDT training disciplines
          </p>
        </div>
        <div className="col-lg-4">
          <div className="input-group mt-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary">
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-5">
          <div className="alert alert-info">
            <h4 className="alert-heading">No categories found</h4>
            <p>Try adjusting your search criteria</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredCategories.map((category) => (
            <div key={category.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm hover-shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary text-white rounded p-3 me-3">
                      <i className="bi bi-grid-3x3-gap fs-3"></i>
                    </div>
                    <h3 className="card-title mb-0">{category.name}</h3>
                  </div>
                  
                  <p className="card-text text-muted mb-4">
                    {category.description || 
                     `Explore comprehensive courses in ${category.name} and enhance your NDT skills with expert-led training.`}
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="badge bg-secondary">
                      {category.lectureCount || 0} Courses
                    </span>
                    <Link 
                      to={`/categories/${category.id}`} 
                      className="btn btn-outline-primary"
                    >
                      Browse Courses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Featured NDT Methods Section */}
      <section className="py-5 mt-5 bg-light rounded">
        <div className="container">
          <h2 className="text-center mb-5">Featured NDT Methods</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="card border-0 text-center h-100">
                <div className="card-body">
                  <div className="mb-3">
                    <img 
                      src="https://www.mme-group.com/fileadmin/_processed_/8/4/csm_MME_RT_Heerenveen-4_533d4bb7aa.jpg" 
                      alt="Radiography Testing"
                      className="rounded-circle bg-primary p-2"
                      width="80"
                      height="80"
                    />
                  </div>
                  <h4>Radiography Testing</h4>
                  <p className="text-muted">
                    Utilizes X-rays or gamma rays to detect internal defects in materials 
                    without damaging the specimen.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 text-center h-100">
                <div className="card-body">
                  <div className="mb-3">
                    <img 
                      src="https://gammabuana.com/wp-content/uploads/2024/10/ultrasonic-testing-non-destructive-test.jpg" 
                      alt="Ultrasonic Testing"
                      className="rounded-circle bg-primary p-2"
                      width="80"
                      height="80"
                    />
                  </div>
                  <h4>Ultrasonic Testing</h4>
                  <p className="text-muted">
                    Uses high-frequency sound waves to detect surface and subsurface 
                    defects in materials.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 text-center h-100">
                <div className="card-body">
                  <div className="mb-3">
                    <img 
                      src="https://hsseworld.com/wp-content/uploads/2021/08/magnetic-particle-testing.jpg" 
                      alt="Magnetic Testing"
                      className="rounded-circle bg-primary p-2"
                      width="80"
                      height="80"
                    />
                  </div>
                  <h4>Magnetic Testing</h4>
                  <p className="text-muted">
                    Detects surface and near-surface discontinuities in ferromagnetic materials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose NDT Training Section */}
      <section className="py-5 mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2>Why Choose NDT Training?</h2>
              <p className="lead">
                Non-Destructive Testing professionals are in high demand across multiple industries.
              </p>
              <ul className="list-unstyled">
                <li className="mb-3 d-flex">
                  <i className="bi bi-check-circle-fill text-primary me-3 fs-4"></i>
                  <div>
                    <h5>Competitive Salary</h5>
                    <p className="text-muted">
                      NDT technicians and inspectors enjoy above-average compensation packages.
                    </p>
                  </div>
                </li>
                <li className="mb-3 d-flex">
                  <i className="bi bi-check-circle-fill text-primary me-3 fs-4"></i>
                  <div>
                    <h5>Global Opportunities</h5>
                    <p className="text-muted">
                      NDT certifications are recognized worldwide, opening doors to international careers.
                    </p>
                  </div>
                </li>
                <li className="mb-3 d-flex">
                  <i className="bi bi-check-circle-fill text-primary me-3 fs-4"></i>
                  <div>
                    <h5>Industry Growth</h5>
                    <p className="text-muted">
                      The NDT market is projected to grow steadily over the next decade.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-lg-6">
              <img 
                src="https://via.placeholder.com/600x400?text=NDT+Certification"
                alt="NDT Certification"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-5 mt-5 bg-primary text-white text-center rounded">
        <div className="container">
          <h2 className="fw-bold mb-3">Ready to Start Your NDT Learning Journey?</h2>
          <p className="lead mb-4">Join our community of professionals and enhance your skills with expert-led training.</p>
          <Link to="/courses" className="btn btn-light btn-lg me-2">Browse Courses</Link>
          <Link to="/register" className="btn btn-outline-light btn-lg">Sign Up Now</Link>
        </div>
      </section>
    </div>
  );
}