import { useState, useEffect } from "react";
import { Link } from "react-router"; 
import api from "../utils/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    search: ""
  });
  const [sort, setSort] = useState("newest");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const addToCart = async (courseId) => {
    try {
      await api.post("/carts/add", { lectureId: courseId });
      // Tampilkan notifikasi sukses (bisa menggunakan toast notification atau alert)
      alert("Kursus berhasil ditambahkan ke keranjang");
    } catch (error) {
      console.error("Error adding course to cart:", error);
      alert("Gagal menambahkan kursus ke keranjang");
    }
  };

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/public/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  
  useEffect(() => {
    // Fetch courses with filters, sorting and pagination
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Build query params
        const queryParams = new URLSearchParams();
        queryParams.append("page", pagination.currentPage);
        queryParams.append("limit", 9);
        
        if (filters.search) queryParams.append("search", filters.search);
        if (filters.categoryId) queryParams.append("categoryId", filters.categoryId);
        if (filters.minPrice) queryParams.append("minPrice", filters.minPrice);
        if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice); // Perbaikan kondisi yang tidak lengkap
        
        // Handle sorting
        if (sort === "price_asc") {
          queryParams.append("sortBy", "price");
          queryParams.append("sortDirection", "ASC");
        } else if (sort === "price_desc") {
          queryParams.append("sortBy", "price");
          queryParams.append("sortDirection", "DESC");
        } else if (sort === "newest") {
          queryParams.append("sortBy", "createdAt");
          queryParams.append("sortDirection", "DESC");
        }
        
        const { data } = await api.get(`/public/lectures?${queryParams.toString()}`);
        setCourses(data.lectures);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalItems: data.totalItems
        });
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters, sort, pagination.currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    // Reset to first page when filter changes
    setPagination({...pagination, currentPage: 1});
  };
  
  const handleSortChange = (e) => {
    setSort(e.target.value);
  };
  
  const handlePageChange = (page) => {
    setPagination({...pagination, currentPage: page});
    // Scroll to top when changing page
    window.scrollTo(0, 0);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">All Courses</h1>
      
      {/* Search & Filters */}
      <div className="card mb-4">
        <div className="card-body">
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
                  <i className="bi bi-search"></i>
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
                {categories.map(category => (
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
                  onClick={() => setFilters({
                    categoryId: "",
                    minPrice: "",
                    maxPrice: "",
                    search: ""
                  })}
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
          <div className="alert alert-info">
            <h4 className="alert-heading">No courses found</h4>
            <p>Try adjusting your filters or search criteria</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-muted mb-4">
            Showing {courses.length} of {pagination.totalItems} courses
          </p>
          
          <div className="row g-4 mb-4">
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
                      <span className="badge bg-secondary">{course.category?.name || "General"}</span>
                      <span className="text-primary fw-bold">{formatToIDR(course.price)}</span>
                    </div>
                    <h5 className="card-title">{course.name}</h5>
                    <p className="card-text text-muted mb-4">{course.technique}</p>
                    <div className="mt-auto">
                      <div className="d-flex gap-2">
                        <Link to={`/courses/${course.id}`} className="btn btn-outline-primary flex-grow-1">
                          Detail
                        </Link>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => addToCart(course.id)}
                        >
                          <i className="bi bi-cart-plus"></i> Tambah
                        </button>
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
                <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(pagination.totalPages).keys()].map(page => (
                  <li 
                    key={page + 1} 
                    className={`page-item ${pagination.currentPage === page + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
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