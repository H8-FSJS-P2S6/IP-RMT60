import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="container text-center py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="mt-5">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead text-muted mb-5">
              Oops! The page you are looking for might have been removed, had its name changed,
              or is temporarily unavailable.
            </p>
            <Link to="/" className="btn btn-primary me-3">
              Back to Home
            </Link>
            <Link to="/courses" className="btn btn-outline-secondary">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}