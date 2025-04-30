import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "User",
    phoneNumber: "",
    address: ""
  });

  // Fetch users with pagination and optional search
  const fetchUsers = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page);
      if (search) params.append("search", search);
      
      const response = await api.get(`/admin/users?${params}`);
      setUsers(response.data.users || response.data);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchTerm);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber || "",
      address: user.address || ""
    });
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
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
      if (selectedUser) {
        await api.put(`/admin/users/${selectedUser.id}`, formData);
      } else {
        await api.post("/admin/users", formData);
      }
      
      // Refresh the user list
      fetchUsers(currentPage, searchTerm);
      
      // Close modal and reset form
      document.getElementById('userFormModal').querySelector('[data-bs-dismiss="modal"]').click();
      setSelectedUser(null);
      setFormData({
        username: "",
        email: "",
        role: "User",
        phoneNumber: "",
        address: ""
      });
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.response?.data?.message || "Failed to save user");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/users/${userToDelete.id}`);
      
      // Remove user from list
      setUsers(users.filter(user => user.id !== userToDelete.id));
      
      // Close modal
      document.getElementById('deleteConfirmModal').querySelector('[data-bs-dismiss="modal"]').click();
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const openNewUserModal = () => {
    setSelectedUser(null);
    setFormData({
      username: "",
      email: "",
      role: "User",
      phoneNumber: "",
      address: ""
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
      <h1 className="mt-4 mb-4">User Management</h1>

      <div className="card mb-4">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className="bi bi-people-fill me-1"></i>
              Users
            </div>
            <button 
              className="btn btn-primary btn-sm" 
              data-bs-toggle="modal" 
              data-bs-target="#userFormModal" 
              onClick={openNewUserModal}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add User
            </button>
          </div>
        </div>
        <div className="card-body">
          {/* Search Form */}
          <div className="row mb-4">
            <div className="col-md-6">
              <form onSubmit={handleSearch} className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Search</button>
              </form>
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
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge ${user.role === "Admin" ? "bg-danger" : "bg-primary"}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditClick(user)}
                            data-bs-toggle="modal"
                            data-bs-target="#userFormModal"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(user)}
                            data-bs-toggle="modal"
                            data-bs-target="#deleteConfirmModal"
                            disabled={user.role === "Admin"}
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

      {/* User Form Modal */}
      <div className="modal fade" id="userFormModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedUser ? 'Edit User' : 'Add New User'}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Role</label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>
                {!selectedUser && (
                  <div className="alert alert-info">
                    <small>
                      <i className="bi bi-info-circle me-1"></i>
                      A temporary password will be generated and sent to the user's email.
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {selectedUser ? 'Update User' : 'Create User'}
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
              <p>Are you sure you want to delete user <strong>{userToDelete?.username}</strong>?</p>
              <p className="text-danger">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}