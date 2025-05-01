import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDriverPosts } from '../store/slices/postSlice';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { driverPosts, loading } = useSelector(state => state.posts);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchDriverPosts());
    
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
  }, [dispatch]);

  return (
    <div className="container-fluid p-0" style={{ width: '100%', maxWidth: '100%', overflow: 'auto' }}>
      <div className="container my-4">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">{user?.role === 'driver' ? 'Driver Dashboard' : 'User Dashboard'}</h2>
            
            {user?.role === 'driver' && (
              <div className="card shadow-sm border-0 rounded-lg mb-5">
                <div className="card-header bg-white py-3">
                  <h4 className="mb-0">Add New Truck Listing</h4>
                </div>
                <div className="card-body">
                  <PostForm />
                </div>
              </div>
            )}
            
            <div className="card shadow-sm border-0 rounded-lg">
              <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                <h4 className="mb-0">{user?.role === 'driver' ? 'Your Truck Listings' : 'Truck Listings'}</h4>
                {driverPosts && driverPosts.length > 0 && (
                  <span className="badge bg-primary rounded-pill">{driverPosts.length}</span>
                )}
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading your listings...</p>
                  </div>
                ) : driverPosts.length === 0 ? (
                  <div className="alert alert-info text-center py-4">
                    <i className="bi bi-truck fs-1 mb-3"></i>
                    <h5>No listings yet</h5>
                    <p>Sorry, there is no post list from driver</p>
                  </div>
                ) : (
                  <div className="row">
                    {driverPosts.map(post => (
                      <div key={post.id} className="col-lg-4 col-md-6 mb-4">
                        <PostCard post={post} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;