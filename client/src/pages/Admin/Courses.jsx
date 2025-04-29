import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    categoryId: "",
    status: ""
  });
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    technique: "",
    image: "",
    experience_years: 0,
    level: "Beginner",
    language: "English",
    instructor: "",
    CategoryId: "",
    status: "Active"
  });
  
  // Fetch courses with pagination and filters
  const fetchCourses = async (page = 1, search = "", filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 10);
      
      if (search) params.append("search", search);
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.status) params.append("status", filters.status);

      const response = await api.get(`/admin/lectures?${params.toString()}`);
      
      setCourses(response.data.lectures);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await api.get("/public/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage, searchTerm, filter);
    fetchCategories();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCourses(1, searchTerm, filter);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchCourses(1, searchTerm, filter);
  };

  const resetFilters = () => {
    setFilter({
      categoryId: "",
      status: ""
    });
    setCurrentPage(1);
    fetchCourses(1, searchTerm, { categoryId: "", status: "" });
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      description: course.description || "",
      price: course.price,
      technique: course.technique || "",
      image: course.image || "",
      experience_years: course.experience_years || 0,
      level: course.level || "Beginner",
      language: course.language || "English",
      instructor: course.instructor || "",
      CategoryId: course.CategoryId || "",
      status: course.status || "Active"
    });
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "experience_years" ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCourse) {
        await api.put(`/admin/lectures/${selectedCourse.id}`, formData);
      } else {
        await api.post("/admin/lectures", formData);
      }
      
      // Refresh the course list
      fetchCourses(currentPage, searchTerm, filter);
      
      // Close modal and reset form
      document.getElementById('courseFormModal').querySelector('[data-bs-dismiss="modal"]').click();
      setSelectedCourse(null);
      resetForm();
    } catch (error) {
      console.error("Error saving course:", error);
      alert(error.response?.data?.message || "Failed to save course");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/lectures/${courseToDelete.id}`);
      
      // Remove course from list
      setCourses(courses.filter(course => course.id !== courseToDelete.id));
      
      // Close modal
      document.getElementById('deleteConfirmModal').querySelector('[data-bs-dismiss="modal"]').click();
      setCourseToDelete(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      alert(error.response?.data?.message || "Failed to delete course");
    }
  };

  const openNewCourseModal = () => {
    setSelectedCourse(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      technique: "",
      image: "",
      experience_years: 0,
      level: "Beginner",
      language: "English",
      instructor: "",
      CategoryId: "",
      status: "Active"
    });
  };

  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4 mb-4">Course Management</h1>

      <div className="card mb-4">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className="bi bi-journal-richtext me-1"></i>
              Courses
            </div>
            <button 
              className="btn btn-primary btn-sm" 
              data-bs-toggle="modal" 
              data-bs-target="#courseFormModal" 
              onClick={openNewCourseModal}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add Course
            </button>
          </div>
        </div>
        <div className="card-body">
          {/* Search and Filter Row */}
          <div className="row mb-4">
            <div className="col-md-6">
              <form onSubmit={handleSearch} className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Search</button>
              </form>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-end">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  data-bs-toggle="collapse"
                  data-bs-target="#filterCollapse"
                >
                  <i className="bi bi-funnel me-1"></i>
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Filter Section */}
          <div className="collapse mb-4" id="filterCollapse">
            <div className="card card-body bg-light">
              <div className="row g-3">
                <div className="col-md-5">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="categoryId"
                    value={filter.categoryId}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-5">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={filter.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <div className="d-grid gap-2 w-100">
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={applyFilters}
                    >
                      Apply
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={resetFilters}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Course Name</th>
                      <th>Category</th>
                      <th>Technique</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course.id}>
                        <td>{course.id}</td>
                        <td>
                          <img 
                            src={course.image || "https://via.placeholder.com/50x50?text=No+Image"} 
                            alt={course.name} 
                            className="img-thumbnail"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          />
                        </td>
                        <td>{course.name}</td>
                        <td>{course.Category?.name || "Uncategorized"}</td>
                        <td>{course.technique || "N/A"}</td>
                        <td>{formatToIDR(course.price)}</td>
                        <td>
                          <span className={`badge ${
                            course.status === "Active" ? "bg-success" :
                            course.status === "Draft" ? "bg-warning" :
                            "bg-secondary"
                          }`}>
                            {course.status}
                          </span>
                        </td>
                        <td>{formatDate(course.createdAt)}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditClick(course)}
                            data-bs-toggle="modal"
                            data-bs-target="#courseFormModal"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(course)}
                            data-bs-toggle="modal"
                            data-bs-target="#deleteConfirmModal"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {[...Array(totalPages).keys()].map(page => (
                      <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => handlePageChange(page + 1)}
                        >
                          {page + 1}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
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
      </div>

      {/* Course Form Modal */}
      <div className="modal fade" id="courseFormModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedCourse ? 'Edit Course' : 'Add New Course'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Course Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="CategoryId" className="form-label">Category</label>
                    <select
                      className="form-select"
                      id="CategoryId"
                      name="CategoryId"
                      value={formData.CategoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3 mt-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <label htmlFor="price" className="form-label">Price (IDR)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="technique" className="form-label">Technique</label>
                    <input
                      type="text"
                      className="form-control"
                      id="technique"
                      name="technique"
                      value={formData.technique}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mb-3 mt-3">
                  <label htmlFor="image" className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="row g-3 mt-1">
                  <div className="col-md-4">
                    <label htmlFor="level" className="form-label">Level</label>
                    <select
                      className="form-select"
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="language" className="form-label">Language</label>
                    <select
                      className="form-select"
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                    >
                      <option value="English">English</option>
                      <option value="Indonesian">Indonesian</option>
                      <option value="Bilingual">Bilingual (Eng/Indo)</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="experience_years" className="form-label">Experience Required (Years)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="experience_years"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <label htmlFor="instructor" className="form-label">Instructor</label>
                    <input
                      type="text"
                      className="form-control"
                      id="instructor"
                      name="instructor"
                      value={formData.instructor}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {selectedCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteConfirmModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the course <strong>{courseToDelete?.name}</strong>?</p>
              <p className="text-danger">This action cannot be undone and will remove all enrollments for this course.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                Delete Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}