import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import PostForm from '../components/PostForm';

const DriverDashboard = () => {
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    // Make sure the page takes the full width
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.width = '100%';
    
    return () => {
      // Clean up
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.width = '';
    };
  }, []);

  // Redirect if user is not logged in or not a driver
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'driver') {
    return <Navigate to="/" />;
  }

  return (
    <div className="container-fluid p-0" style={{ width: '100%', maxWidth: '100%', overflow: 'auto' }}>
      <div className="container my-4">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0 rounded-lg mb-5">
              <div className="card-header bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Driver Dashboard</h4>
                  <Link to="/driver/posts" className="btn btn-primary">
                    <i className="bi bi-list-ul me-2"></i>
                    View My Listings
                  </Link>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-8 offset-md-2">
                    <div className="alert alert-info">
                      <h5 className="alert-heading">
                        <i className="bi bi-info-circle me-2"></i>
                        Welcome to your Dashboard!
                      </h5>
                      <p className="mb-0">
                        Here you can create new truck listings for customers to find.
                        You can view and manage all your listings from the "View My Listings" page.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h5 className="mb-3 text-center">Add New Truck Listing</h5>
                <PostForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;