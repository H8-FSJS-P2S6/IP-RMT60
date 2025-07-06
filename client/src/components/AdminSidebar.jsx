import { NavLink,useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { showToast } from "../utils/toast";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    showToast.success("Logged out successfully");
    
    // Add small delay to ensure auth state updates before navigation
    setTimeout(() => {
      navigate("/login");
    }, 50);
  };

  return (
    <div
      className="bg-dark text-white d-flex flex-column"
      style={{ width: "280px", minHeight: "100vh" }}
    >
      <div className="d-flex align-items-center p-3 border-bottom border-secondary">
        <div className="text-center w-100">
          <h4 className="mb-0">Admin Panel</h4>
        </div>
      </div>

      <div className="p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center">
          <div className="me-3">
            <div
              className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              <span className="fw-bold">
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
          </div>
          <div>
            <p className="mb-0 fw-bold">{user?.username || "Admin"}</p>
            <small className="text-muted">
              {user?.email || "admin@example.com"}
            </small>
          </div>
        </div>
      </div>

      <div className="flex-grow-1">
        <ul className="nav flex-column p-3">
          <li className="nav-item mb-2">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-3 py-2 rounded ${
                  isActive ? "bg-primary text-white" : "text-white"
                }`
              }
            >
              <i className="bi bi-speedometer2 me-3"></i>
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-3 py-2 rounded ${
                  isActive ? "bg-primary text-white" : "text-white"
                }`
              }
            >
              <i className="bi bi-people me-3"></i>
              Users
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              to="/admin/courses"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-3 py-2 rounded ${
                  isActive ? "bg-primary text-white" : "text-white"
                }`
              }
            >
              <i className="bi bi-journal-richtext me-3"></i>
              Courses
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-3 py-2 rounded ${
                  isActive ? "bg-primary text-white" : "text-white"
                }`
              }
            >
              <i className="bi bi-tag me-3"></i>
              Categories
            </NavLink>
          </li>
          <li className="nav-item mb-2">
            <NavLink
              to="/admin/payments"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center px-3 py-2 rounded ${
                  isActive ? "bg-primary text-white" : "text-white"
                }`
              }
            >
              <i className="bi bi-credit-card me-3"></i>
              Payments
            </NavLink>
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
