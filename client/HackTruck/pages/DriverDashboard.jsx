import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDriverPosts } from '../store/slices/postSlice';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';

const DriverDashboard = () => {
  const dispatch = useDispatch();
  const { driverPosts, loading } = useSelector(state => state.posts);

  useEffect(() => {
    dispatch(fetchDriverPosts());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h2>Driver Dashboard</h2>
      <PostForm />
      <h3>Your Posts</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {driverPosts.map(post => (
            <div key={post.id} className="col-md-4">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;