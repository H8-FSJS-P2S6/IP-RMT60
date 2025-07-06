import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminCourses() {
  const [lectures, setLectures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [lectureToDelete, setLectureToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    technique: '',
    CategoryId: '',
    price: '',
    description: '',
    duration: '',
    imageUrl: '',
    videoUrl: ''
  });

  // Image preview
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchLectures();
    fetchCategories();
  }, [currentPage, searchTerm]);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage);
      if (searchTerm) params.append("search", searchTerm);

      const { data } = await api.get(`/admin/lectures?${params}`);
      setLectures(data.lectures || data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching lectures:", error);
      setError("Failed to load courses");
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get(`/admin/categories`);
      setCategories(data.categories || data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseInt(value) || '' : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Set file for upload
      setFormData({
        ...formData,
        imageFile: file
      });
    }
  };

  const openFormModal = (lecture = null) => {
    if (lecture) {
      // Edit mode
      setSelectedLecture(lecture);
      setFormData({
        name: lecture.name,
        technique: lecture.technique,
        CategoryId: lecture.CategoryId || '',
        price: lecture.price,
        description: lecture.description || '',
        duration: lecture.duration || '',
        imageUrl: lecture.imageUrl || '',
        videoUrl: lecture.videoUrl || ''
      });
      setImagePreview(lecture.imageUrl || '');
    } else {
      // Create mode
      setSelectedLecture(null);
      setFormData({
        name: '',
        technique: '',
        CategoryId: '',
        price: '',
        description: '',
        duration: '',
        imageUrl: '',
        videoUrl: ''
      });
      setImagePreview('');
    }
    // Open modal
    const modal = new window.bootstrap.Modal(document.getElementById('lectureFormModal'));
    modal.show();
  };

  const openDeleteModal = (lecture) => {
    setLectureToDelete(lecture);
    const modal = new window.bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    modal.show();
  };

  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      const formDataToSend = new FormData();
      
      // Add form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'imageFile') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add image file if available
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      if (selectedLecture) {
        // Update lecture
        response = await api.put(`/admin/lectures/${selectedLecture.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Course updated successfully");
      } else {
        // Create new lecture
        response = await api.post('/admin/lectures', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log(response);
        
        toast.success("Course created successfully");
      }

      // Close modal
      document.getElementById('lectureFormModal').querySelector('[data-bs-dismiss="modal"]').click();
      
      // Refresh lectures list
      fetchLectures();
    } catch (error) {
      console.error("Error saving lecture:", error);
      const errorMsg = error.response?.data?.message || "Failed to save course";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async () => {
    if (!lectureToDelete) return;
    
    try {
      await api.delete(`/admin/lectures/${lectureToDelete.id}`);
      toast.success("Course deleted successfully");
      
      // Remove from local state
      setLectures(lectures.filter(lecture => lecture.id !== lectureToDelete.id));
      
      // Close modal
      document.getElementById('deleteConfirmModal').querySelector('[data-bs-dismiss="modal"]').click();
      setLectureToDelete(null);
    } catch (error) {
      console.error("Error deleting lecture:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete course";
      toast.error(errorMsg);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchLectures();
  };

  if (loading && lectures.length === 0) {
    return (
      <div className="container-fluid px-4">
        <h1 className="mt-4">Courses Management</h1>
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="mt-4">Courses Management</h1>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => openFormModal()}
          >
            <i className="fas fa-plus me-1"></i> New Course
          </button>
        </div>
        
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div><i className="fas fa-book-open me-1"></i> Course List</div>
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                type="text"
                className="form-control form-control-sm me-2"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '200px' }}
              />
              <button type="submit" className="btn btn-sm btn-outline-primary">
                Search
              </button>
            </form>
          </div>
          <div className="card-body">
            {error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th style={{width: '80px'}}>Image</th>
                      <th>Name</th>
                      <th>Technique</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lectures.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">No courses found</td>
                      </tr>
                    ) : (
                      lectures.map((lecture) => (
                        <tr key={lecture.id}>
                          <td>
                            {lecture.imageUrl ? (
                              <img 
                                src={lecture.imageUrl} 
                                alt={lecture.name}
                                className="img-thumbnail"
                                style={{width: '60px', height: '60px', objectFit: 'cover'}}
                              />
                            ) : (
                              <div className="bg-light d-flex justify-content-center align-items-center"
                                style={{width: '60px', height: '60px'}}>
                                <i className="fas fa-image text-secondary"></i>
                              </div>
                            )}
                          </td>
                          <td>{lecture.name}</td>
                          <td>{lecture.technique}</td>
                          <td>{lecture.category?.name || '-'}</td>
                          <td>{formatToIDR(lecture.price)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => openFormModal(lecture)}
                              >
                                <i className="fas fa-edit">Edit</i>
                              </button>
                              <button 
                                className="btn btn-sm btn-danger"
                                onClick={() => openDeleteModal(lecture)}
                              >
                                <i className="fas fa-trash">Delete</i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {totalPages > 1 && (
              <nav>
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </div>
      </div>
      
      {/* Lecture Form Modal */}
      <div className="modal fade" id="lectureFormModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedLecture ? 'Edit Course' : 'Add New Course'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-8">
                    <div className="mb-3">
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
                    
                    <div className="mb-3">
                      <label htmlFor="technique" className="form-label">Technique</label>
                      <input
                        type="text"
                        className="form-control"
                        id="technique"
                        name="technique"
                        value={formData.technique}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
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
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label htmlFor="price" className="form-label">Price (IDR)</label>
                        <input
                          type="number"
                          className="form-control"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Course Image</label>
                      <div 
                        className="border rounded p-2 text-center mb-2"
                        style={{height: '180px', cursor: 'pointer'}}
                        onClick={() => fileInputRef.current.click()}
                      >
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Course preview" 
                            style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} 
                          />
                        ) : (
                          <div className="d-flex flex-column justify-content-center align-items-center h-100">
                            <i className="fas fa-cloud-upload-alt fa-3x text-secondary"></i>
                            <p className="mt-2 mb-0 small">Click to upload image</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        className="d-none"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <div className="d-grid">
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => fileInputRef.current.click()}
                        >
                          {imagePreview ? 'Change Image' : 'Upload Image'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="duration" className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      id="duration"
                      name="duration"
                      placeholder="e.g. 2 weeks"
                      value={formData.duration}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="videoUrl" className="form-label">Video URL (Optional)</label>
                    <input
                      type="url"
                      className="form-control"
                      id="videoUrl"
                      name="videoUrl"
                      placeholder="e.g. https://youtube.com/..."
                      value={formData.videoUrl}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {selectedLecture ? 'Update Course' : 'Create Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteConfirmModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirm Delete</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the course: <strong>{lectureToDelete?.name}</strong>?</p>
              <p className="text-danger mb-0">
                <i className="fas fa-exclamation-triangle me-2"></i>
                This action cannot be undone. All data related to this course will be permanently removed.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" onClick={handleDelete}>
                Delete Course
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
