import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [orders, setOrders] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    orders: true,
    courses: true
  });
  const [error, setError] = useState({
    profile: "",
    password: "",
    orders: "",
    courses: ""
  });
  const [success, setSuccess] = useState({
    profile: "",
    password: ""
  });

  useEffect(() => {
    // Fetch user's orders
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders");
        setOrders(data);
      } catch (err) {
        setError({...err, orders: "Failed to fetch order history"});
      } finally {
        setLoading({...loading, orders: false});
      }
    };

    // Fetch user's enrolled courses
    const fetchEnrolledCourses = async () => {
      try {
        const { data } = await api.get("/enrollments");
        setEnrolledCourses(data);
      } catch (err) {
        setError({...err, courses: "Failed to fetch enrolled courses"});
      } finally {
        setLoading({...loading, courses: false});
      }
    };

    fetchOrders();
    fetchEnrolledCourses();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({...profileData, [name]: value});
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({...passwordData, [name]: value});
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading({...loading, profile: true});
    setError({...error, profile: ""});
    setSuccess({...success, profile: ""});
    
    try {
      await api.put("/users/profile", profileData);
      setSuccess({...success, profile: "Profile updated successfully!"});
      
      // Update local storage user data
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      localStorage.setItem("user", JSON.stringify({
        ...userData,
        username: profileData.username,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address
      }));
      
    } catch (err) {
      setError({...error, profile: err.response?.data?.message || "Failed to update profile"});
    } finally {
      setLoading({...loading, profile: false});
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError({...error, password: "Passwords don't match"});
      return;
    }
    
    setLoading({...loading, password: true});
    setError({...error, password: ""});
    setSuccess({...success, password: ""});
    
    try {
      await api.put("/users/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess({...success, password: "Password updated successfully!"});
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
    } catch (err) {
      setError({...error, password: err.response?.data?.message || "Failed to update password"});
    } finally {
      setLoading({...loading, password: false});
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">My Account</h1>
      
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px" }}>
                  <span className="fw-bold">{user?.username?.charAt(0).toUpperCase() || "U"}</span>
                </div>
                <div>
                  <h5 className="card-title mb-0">{user?.username}</h5>
                  <small className="text-muted">{user?.email}</small>
                </div>
              </div>
              
              <div className="list-group list-group-flush">
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <i className="bi bi-person me-2"></i> Profile
                </button>
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === "password" ? "active" : ""}`}
                  onClick={() => setActiveTab("password")}
                >
                  <i className="bi bi-shield-lock me-2"></i> Change Password
                </button>
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === "orders" ? "active" : ""}`}
                  onClick={() => setActiveTab("orders")}
                >
                  <i className="bi bi-bag me-2"></i> Order History
                </button>
                <button 
                  className={`list-group-item list-group-item-action ${activeTab === "courses" ? "active" : ""}`}
                  onClick={() => setActiveTab("courses")}
                >
                  <i className="bi bi-journal-richtext me-2"></i> My Courses
                </button>
                <button 
                  className="list-group-item list-group-item-action text-danger"
                  onClick={logout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-9">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Profile Information</h5>
              </div>
              <div className="card-body">
                {success.profile && (
                  <div className="alert alert-success" role="alert">
                    {success.profile}
                  </div>
                )}
                
                {error.profile && (
                  <div className="alert alert-danger" role="alert">
                    {error.profile}
                  </div>
                )}
                
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
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
                      value={profileData.email}
                      disabled
                      aria-describedby="emailHelp"
                    />
                    <div id="emailHelp" className="form-text">Email cannot be changed.</div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      id="address"
                      name="address"
                      rows="3"
                      value={profileData.address}
                      onChange={handleProfileChange}
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading.profile}
                  >
                    {loading.profile ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          )}
          
          {/* Password Tab */}
          {activeTab === "password" && (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Change Password</h5>
              </div>
              <div className="card-body">
                {success.password && (
                  <div className="alert alert-success" role="alert">
                    {success.password}
                  </div>
                )}
                
                {error.password && (
                  <div className="alert alert-danger" role="alert">
                    {error.password}
                  </div>
                )}
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      minLength="6"
                    />
                    <div className="form-text">Password must be at least 6 characters long.</div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading.password}
                  >
                    {loading.password ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          )}
          
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">Order History</h5>
              </div>
              <div className="card-body">
                {loading.orders ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading orders...</p>
                  </div>
                ) : error.orders ? (
                  <div className="alert alert-danger" role="alert">
                    {error.orders}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-bag-x fs-1 text-secondary mb-3"></i>
                    <h5>No Orders Yet</h5>
                    <p className="text-muted">You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{formatDate(order.createdAt)}</td>
                            <td>{order.items?.length || 0}</td>
                            <td>{formatToIDR(order.totalAmount)}</td>
                            <td>
                              <span className={`badge ${
                                order.status === 'completed' ? 'bg-success' : 
                                order.status === 'processing' ? 'bg-warning' : 
                                order.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">My Courses</h5>
              </div>
              <div className="card-body">
                {loading.courses ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading courses...</p>
                  </div>
                ) : error.courses ? (
                  <div className="alert alert-danger" role="alert">
                    {error.courses}
                  </div>
                ) : enrolledCourses.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-journal-x fs-1 text-secondary mb-3"></i>
                    <h5>No Enrolled Courses</h5>
                    <p className="text-muted">You haven't enrolled in any courses yet.</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {enrolledCourses.map(enrollment => (
                      <div key={enrollment.id} className="col-md-6">
                        <div className="card h-100 shadow-sm hover-shadow">
                          <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="badge bg-success">Enrolled</span>
                              <small className="text-muted">Enrolled on {formatDate(enrollment.createdAt)}</small>
                            </div>
                            <h5 className="card-title">{enrollment.Lecture.name}</h5>
                            <p className="card-text text-muted">
                              {enrollment.Lecture.technique}
                            </p>
                            <p className="card-text mb-4">
                              <small className="text-muted">
                                Progress: {enrollment.progress || 0}% complete
                              </small>
                              <div className="progress mt-2" style={{ height: "5px" }}>
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{ width: `${enrollment.progress || 0}%` }}
                                  aria-valuenow={enrollment.progress || 0} 
                                  aria-valuemin="0" 
                                  aria-valuemax="100"
                                ></div>
                              </div>
                            </p>
                            <div className="mt-auto">
                              <a href="#" className="btn btn-primary d-block">Continue Learning</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}