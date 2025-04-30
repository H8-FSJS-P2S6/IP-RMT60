import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ""
    });
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await api.put(`/admin/categories/${selectedCategory.id}`, formData);
      } else {
        await api.post("/admin/categories", formData);
      }
      
      // Refresh the category list
      fetchCategories();
      
      // Close modal and reset form
      document.getElementById('categoryFormModal').querySelector('[data-bs-dismiss="modal"]').click();
      setSelectedCategory(null);
      setFormData({
        name: "",
        description: ""
      });
    } catch (error) {
      console.error("Error saving category:", error);
      alert(error.response?.data?.message || "Failed to save category");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/categories/${categoryToDelete.id}`);
      
      // Remove category from list
      setCategories(categories.filter(category => category.id !== categoryToDelete.id));
      
      // Close modal
      document.getElementById('deleteConfirmModal').querySelector('[data-bs-dismiss="modal"]').click();
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  const openNewCategoryModal = () => {
    setSelectedCategory(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: ""
    });
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
      <h1 className="mt-4 mb-4">Category Management</h1>

      <div className="card mb-4">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className="bi bi-tag-fill me-1"></i>
              Categories
            </div>
            <button 
              className="btn btn-primary btn-sm" 
              data-bs-toggle="modal" 
              data-bs-target="#categoryFormModal" 
              onClick={openNewCategoryModal}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add Category
            </button>
          </div>
        </div>
        <div className="card-body">
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
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Course Count</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.id}</td>
                      <td>{category.name}</td>
                      <td>{category.description || <em className="text-muted">No description</em>}</td>
                      <td>{category.lectureCount || 0}</td>
                      <td>{formatDate(category.createdAt)}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEditClick(category)}
                          data-bs-toggle="modal"
                          data-bs-target="#categoryFormModal"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteClick(category)}
                          data-bs-toggle="modal"
                          data-bs-target="#deleteConfirmModal"
                          disabled={category.lectureCount > 0}
                          title={category.lectureCount > 0 ? "Cannot delete category with courses" : "Delete"}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Category Form Modal */}
      <div className="modal fade" id="categoryFormModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedCategory ? 'Edit Category' : 'Add New Category'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Category Name</label>
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
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Optional description"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {selectedCategory ? 'Update Category' : 'Create Category'}
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
              <p>Are you sure you want to delete the category <strong>{categoryToDelete?.name}</strong>?</p>
              <p className="text-danger">This action cannot be undone.</p>
              {categoryToDelete?.lectureCount > 0 && (
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Cannot delete category that has courses assigned to it.
                  Please reassign or delete the courses first.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={confirmDelete}
                disabled={categoryToDelete?.lectureCount > 0}
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}