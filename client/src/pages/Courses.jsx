import { useEffect } from "react";
import { Link } from "react-router"; 
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCourses,
  setFilters,
  setSort,
  setPage,
  selectCourses,
  selectCoursesLoading,
  selectCoursesPagination,
  selectCoursesFilters,
  selectCoursesSort,
} from "../store/slices/courseSlice";
import {
  fetchCategories,
  selectCategories,
} from "../store/slices/categorySlice";
import { addToCart } from "../store/slices/cartSlice";
import { selectIsAuthenticated } from "../store/slices/authSlice";
import { toast } from "react-toastify";

export default function Courses() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated); 
  const courses = useAppSelector(selectCourses);
  const loading = useAppSelector(selectCoursesLoading);
  

  const pagination = useAppSelector(selectCoursesPagination);
  const filters = useAppSelector(selectCoursesFilters);
  const sort = useAppSelector(selectCoursesSort);
  const categories = useAppSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchCourses({
        page: pagination.currentPage,
        ...filters,
        sort,
      })
    );
  }, [dispatch, pagination.currentPage, filters, sort]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(
      setFilters({
        ...filters,
        [name]: value,
      })
    );
  };

  const handleSortChange = (e) => {
    dispatch(setSort(e.target.value));
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  const handleAddToCart = (courseId) => {
    dispatch(addToCart(courseId));
    toast.success("Course added to cart", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const formatToIDR = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="row mb-5">
        <div className="col-lg-8">
          <h1 className="section-title">Explore NDT Courses</h1>
          <p className="section-subtitle">Advance your career with industry-leading Non-Destructive Testing certification programs</p>
        </div>
        <div className="col-lg-4 d-flex align-items-center justify-content-lg-end">
          <div className="d-flex align-items-center bg-light rounded-pill px-3 py-2">
            <i className="bi bi-mortarboard me-2 text-primary"></i>
            <span className="fw-semibold">{pagination.totalItems} Courses Available</span>
          </div>
        </div>
      </div>

      {/* Enhanced Search & Filters */}
      <div className="card-modern mb-5">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search courses..."
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                />
                <button className="btn btn-primary">
                  Search
                </button>
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                name="categoryId"
                value={filters.categoryId}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={sort}
                onChange={handleSortChange}
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                data-bs-toggle="collapse"
                data-bs-target="#advancedFilters"
              >
                More Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="collapse mt-3" id="advancedFilters">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Price Range</label>
                <div className="d-flex gap-2">
                  <div className="input-group">
                    <span className="input-group-text">Rp</span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">Rp</span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-6 d-flex align-items-end">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() =>
                    dispatch(
                      setFilters({
                        categoryId: "",
                        minPrice: "",
                        maxPrice: "",
                        search: "",
                      })
                    )
                  }
                >
                  Reset Filters
                </button>
                <button className="btn btn-primary">Apply Filters</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Results */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-5">
          <div className="bg-light rounded-modern p-5">
            <div className="mb-4">
              <i className="bi bi-search display-1 text-muted"></i>
            </div>
            <h4 className="fw-bold mb-3">No courses found</h4>
            <p className="text-muted mb-4">We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.</p>
            <button 
              className="btn btn-primary"
              onClick={() =>
                dispatch(
                  setFilters({
                    categoryId: "",
                    minPrice: "",
                    maxPrice: "",
                    search: "",
                  })
                )
              }
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <span className="text-muted">Showing</span>
              <span className="fw-bold mx-1">{courses.length}</span>
              <span className="text-muted">of</span>
              <span className="fw-bold mx-1">{pagination.totalItems}</span>
              <span className="text-muted">courses</span>
            </div>
            <div className="d-flex align-items-center">
              <i className="bi bi-grid-3x3-gap me-2 text-primary"></i>
              <span className="small text-muted">Grid View</span>
            </div>
          </div>

          <div className="row g-4 mb-5">
            {courses.map((course, index) => (
              <div key={course.id} className="col-md-6 col-lg-4">
                <div className="card-course position-relative">
                  <div className="position-relative overflow-hidden">
                    <img
                      src={
                        course.image ||
                        "https://via.placeholder.com/320x180?text=NDT+Course&bg=2C3E50&color=ffffff"
                      }
                      className="card-img-top"
                      alt={course.name}
                    />
                    <div className="position-absolute top-0 start-0 m-3">
                      {index % 3 === 0 && <span className="badge bg-success">Popular</span>}
                      {index % 3 === 1 && <span className="badge bg-warning text-dark">Featured</span>}
                      {index % 3 === 2 && <span className="badge bg-info">Trending</span>}
                    </div>
                    <div className="position-absolute bottom-0 end-0 m-3">
                      <span className="badge badge-modern">
                        {course.category?.name || "General"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <div className="bg-gradient-primary rounded-circle p-1 me-2" style={{ width: '24px', height: '24px' }}>
                          <i className="bi bi-star-fill text-white" style={{ fontSize: '0.75rem' }}></i>
                        </div>
                        <small className="text-muted">4.{Math.floor(Math.random() * 5) + 5} ({Math.floor(Math.random() * 200) + 50} reviews)</small>
                      </div>
                      <span className="text-primary fw-bold fs-5">{formatToIDR(course.price)}</span>
                    </div>
                    
                    <h5 className="card-title mb-2" style={{ 
                      fontSize: '1.1rem', 
                      lineHeight: '1.3',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {course.name}
                    </h5>
                    
                    <p className="card-text text-muted mb-3" style={{ 
                      fontSize: '0.9rem',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {course.technique}
                    </p>
                    
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-clock me-1"></i>
                        <small>Self-paced</small>
                      </div>
                      <div className="d-flex align-items-center text-muted">
                        <i className="bi bi-people me-1"></i>
                        <small>{Math.floor(Math.random() * 100) + 25} students</small>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="d-flex gap-2">
                        <Link
                          to={`/courses/${course.id}`}
                          className={`btn btn-outline-primary ${!isAuthenticated ? 'flex-grow-1' : 'flex-grow-1'}`}
                        >
                          <i className="bi bi-eye me-2"></i>
                          View Details
                        </Link>
                        {isAuthenticated && (
                          <button
                            className="btn btn-primary px-3"
                            onClick={() => handleAddToCart(course.id)}
                            title="Add to Cart"
                          >
                            <i className="bi bi-cart-plus"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <nav aria-label="Course pagination">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${
                    pagination.currentPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {[...Array(pagination.totalPages).keys()].map((page) => (
                  <li
                    key={page + 1}
                    className={`page-item ${
                      pagination.currentPage === page + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    pagination.currentPage === pagination.totalPages
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
