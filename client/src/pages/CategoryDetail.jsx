import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import api from "../utils/api";

export default function CategoryDetail() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("newest");
  
  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        // Get category details
        const categoryResponse = await api.get(`/public/categories/${id}`);
        setCategory(categoryResponse.data);
        
        // Get courses in this category
        const coursesResponse = await api.get(`/public/lectures?categoryId=${id}`);
        setCourses(coursesResponse.data.lectures || []);
      } catch (error) {
        console.error("Error fetching category details:", error);
        setError("Failed to load category details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [id]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    
    // Sort courses based on selected option
    let sortedCourses = [...courses];
    
    if (e.target.value === "price_asc") {
      sortedCourses.sort((a, b) => a.price - b.price);
    } else if (e.target.value === "price_desc") {
      sortedCourses.sort((a, b) => b.price - a.price);
    } else if (e.target.value === "newest") {
      sortedCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    setCourses(sortedCourses);
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
        <Link to="/categories" className="btn btn-primary">
          Back to Categories
        </Link>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Category not found
        </div>
        <Link to="/categories" className="btn btn-primary">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/categories">Categories</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{category.name}</li>
        </ol>
      </nav>

      <div className="row mb-5">
        <div className="col-lg-8">
          <h1 className="mb-3">{category.name}</h1>
          <p className="lead">
            {category.description || 
             `Explore our comprehensive collection of courses in ${category.name}. 
              Gain expertise and advance your career with industry-recognized certifications.`}
          </p>
        </div>
        <div className="col-lg-4 d-flex justify-content-lg-end align-items-center">
          <div className="d-flex align-items-center">
            <label htmlFor="sort" className="me-2">Sort by:</label>
            <select 
              id="sort"
              className="form-select" 
              value={sort}
              onChange={handleSortChange}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="alert alert-info">
          No courses available in this category yet. Check back soon!
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div key={course.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm hover-shadow">
                <img
                  src={course.image || "https://via.placeholder.com/300x200?text=NDT+Course"}
                  className="card-img-top"
                  alt={course.name}
                  height="200"
                  style={{ objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-secondary">{category.name}</span>
                    <span className="text-primary fw-bold">{formatToIDR(course.price)}</span>
                  </div>
                  <h5 className="card-title">{course.name}</h5>
                  <p className="card-text text-muted mb-4">{course.technique}</p>
                  <div className="mt-auto">
                    <Link to={`/courses/${course.id}`} className="btn btn-primary d-block">View Details</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Related Categories Section */}
      <section className="mt-5 py-5">
        <h3 className="mb-4">Explore Other Categories</h3>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card bg-light border-0">
              <div className="card-body">
                <h5 className="card-title">Ultrasonic Testing</h5>
                <p className="text-muted">Detect flaws using high-frequency sound waves</p>
                <Link to="/categories/2" className="btn btn-outline-primary btn-sm">View Category</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light border-0">
              <div className="card-body">
                <h5 className="card-title">Magnetic Testing</h5>
                <p className="text-muted">Locate surface defects in ferromagnetic materials</p>
                <Link to="/categories/3" className="btn btn-outline-primary btn-sm">View Category</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-light border-0">
              <div className="card-body">
                <h5 className="card-title">Penetrant Testing</h5>
                <p className="text-muted">Identify surface-breaking defects in materials</p>
                <Link to="/categories/4" className="btn btn-outline-primary btn-sm">View Category</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Career Paths Section */}
      <section className="mt-5 py-5 bg-light rounded">
        <div className="container">
          <h3 className="mb-4 text-center">Career Paths in {category.name}</h3>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Entry Level Technician</h5>
                  <p className="text-muted">Start your career with Level I certification and gain practical experience in testing procedures.</p>
                  <ul className="list-unstyled">
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Basic testing operations</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Equipment calibration</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Data collection</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Advanced Inspector</h5>
                  <p className="text-muted">With Level II certification, perform advanced inspections and interpret results.</p>
                  <ul className="list-unstyled">
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Advanced testing techniques</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Result interpretation</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Procedure selection</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">NDT Specialist</h5>
                  <p className="text-muted">As a Level III specialist, oversee testing operations and develop procedures.</p>
                  <ul className="list-unstyled">
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Method development</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Training supervision</li>
                    <li><i className="bi bi-check-circle-fill text-success me-2"></i>Quality assurance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}