import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };
  
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };
  
  return (
    <div className="bg-dark text-white d-flex flex-column" style={{ width: "280px", minHeight: "100vh" }}>
      <div className="d-flex align-items-center p-3 border-bottom border-secondary">
        <div className="text-center w-100">
          <h4 className="mb-0">Admin Panel</h4>
        </div>
      </div>
      
      <div className="p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center">
          <div className="me-3">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
              <span className="fw-bold">{user?.username?.charAt(0).toUpperCase() || "A"}</span>
            </div>
          </div>
          <div>
            <p className="mb-0 fw-bold">{user?.username || "Admin"}</p>
            <small className="text-muted">{user?.email || "admin@example.com"}</small>
          </div>
        </div>
      </div>
      
      <div className="flex-grow-1">
        <ul className="nav flex-column p-3">
          <li className="nav-item mb-2">
            <Link 
              to="/admin/dashboard" 
              className={`nav-link ${isActive("/admin/dashboard")} d-flex align-items-center px-3 py-2 rounded ${isActive("/admin/dashboard") ? "bg-primary" : "text-white"}`}
            >
              <i className="bi bi-speedometer2 me-3"></i>
              Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link 
              to="/admin/users" 
              className={`nav-link ${isActive("/admin/users")} d-flex align-items-center px-3 py-2 rounded ${isActive("/admin/users") ? "bg-primary" : "text-white"}`}
            >
              <i className="bi bi-people me-3"></i>
              Users
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link 
              to="/admin/courses" 
              className={`nav-link ${isActive("/admin/courses")} d-flex align-items-center px-3 py-2 rounded ${isActive("/admin/courses") ? "bg-primary" : "text-white"}`}
            >
              <i className="bi bi-journal-richtext me-3"></i>
              Courses
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link 
              to="/admin/categories" 
              className={`nav-link ${isActive("/admin/categories")} d-flex align-items-center px-3 py-2 rounded ${isActive("/admin/categories") ? "bg-primary" : "text-white"}`}
            >
              <i className="bi bi-tag me-3"></i>
              Categories
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link 
              className={`nav-link ${isActive("/admin/payments")} d-flex align-items-center px-3 py-2 rounded ${isActive("/admin/payments") ? "bg-primary" : "text-white"}`} 
              to="/admin/payments"
            >
              <i className="bi bi-credit-card me-3"></i>
              Payments
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="mt-auto p-3 border-top border-secondary">
        <button 
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Sign Out
        </button>
      </div>
    </div>
  );
}