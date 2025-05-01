import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, getTruckRecommendation, clearRecommendation } from '../store/slices/postSlice';
import PostCard from '../components/PostCard';
import Map from '../components/Map';

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, totalPages, currentPage, recommendation } = useSelector(state => state.posts);
  const [filters, setFilters] = useState({
    search: '',
    truckType: '',
    sortBy: 'createdAt',
    order: 'DESC',
    page: 1,
  });
  const [weight, setWeight] = useState('');

  useEffect(() => {
    dispatch(fetchPosts(filters));
  }, [filters, dispatch]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  const handleRecommendation = (e) => {
    e.preventDefault();
    dispatch(getTruckRecommendation(weight));
  };

  return (
    <div className="container mt-4">
      <h2>Available Trucks</h2>
      <div className="row mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search origin/destination"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            name="truckType"
            value={filters.truckType}
            onChange={handleFilterChange}
          >
            <option value="">All Truck Types</option>
            <option value="pickup">Pickup</option>
            <option value="box">Box</option>
            <option value="flatbed">Flatbed</option>
            <option value="refrigerated">Refrigerated</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="createdAt">Newest First</option>
            <option value="maxWeight">Weight</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            name="order"
            value={filters.order}
            onChange={handleFilterChange}
          >
            <option value="DESC">High to Low</option>
            <option value="ASC">Low to High</option>
          </select>
        </div>
      </div>
      <div className="card p-4 mb-4">
        <h4>Find Suitable Truck</h4>
        <form onSubmit={handleRecommendation} className="row g-3">
          <div className="col-md-6">
            <input
              type="number"
              className="form-control"
              placeholder="Enter weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <button type="submit" className="btn btn-primary">Get Recommendation</button>
            {recommendation && (
              <button 
                type="button" 
                className="btn btn-secondary ms-2"
                onClick={() => dispatch(clearRecommendation())}
              >
                Clear
              </button>
            )}
          </div>
        </form>
        {recommendation && (
          <div className="alert alert-info mt-3">
            {recommendation}
          </div>
        )}
      </div>
      <Map />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row">
          {posts.map(post => (
            <div key={post.id} className="col-md-4">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
      <nav>
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => setFilters({ ...filters, page })}
              >
                {page}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Home;