import { useSelector, useDispatch } from 'react-redux';
import { deletePost, updatePost } from '../store/slices/postSlice';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { useState } from 'react';

const PostCard = ({ post }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    departureDate: post.departureDate.split('T')[0],
    origin: post.origin,
    destination: post.destination,
    truckType: post.truckType,
    maxWeight: post.maxWeight,
    phoneNumber: post.phoneNumber,
  });
  const [image, setImage] = useState(null);

  const mapStyles = {        
    height: "200px",
    width: "100%",
    borderRadius: "8px"
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);
    
    dispatch(updatePost({ id: post.id, postData: data }));
    setIsEditing(false);
  };

  // Get truck icon based on truck type
  const getTruckIcon = (type) => {
    const icons = {
      pickup: '🛻',
      box: '📦',
      flatbed: '🚚',
      refrigerated: '❄️'
    };
    return icons[type] || '🚚';
  };

  return (
    <div className="card post-card mb-4">
      <div className="card-body">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="edit-form">
            <h5 className="mb-4 text-center">Edit Delivery Details</h5>
            <div className="mb-3">
              <label className="form-label">Departure Date</label>
              <input 
                type="date" 
                className="form-control" 
                name="departureDate" 
                value={formData.departureDate} 
                onChange={(e) => setFormData({...formData, departureDate: e.target.value})} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Origin</label>
              <input 
                type="text" 
                className="form-control" 
                name="origin" 
                value={formData.origin} 
                onChange={(e) => setFormData({...formData, origin: e.target.value})} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Destination</label>
              <input 
                type="text" 
                className="form-control" 
                name="destination" 
                value={formData.destination} 
                onChange={(e) => setFormData({...formData, destination: e.target.value})} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Truck Type</label>
              <select 
                className="form-control" 
                name="truckType" 
                value={formData.truckType} 
                onChange={(e) => setFormData({...formData, truckType: e.target.value})}
              >
                <option value="pickup">Pickup</option>
                <option value="box">Box</option>
                <option value="flatbed">Flatbed</option>
                <option value="refrigerated">Refrigerated</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Max Weight (kg)</label>
              <input 
                type="number" 
                className="form-control" 
                name="maxWeight" 
                value={formData.maxWeight} 
                onChange={(e) => setFormData({...formData, maxWeight: e.target.value})} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Number</label>
              <input 
                type="tel" 
                className="form-control" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Truck Image</label>
              <input 
                type="file" 
                className="form-control" 
                onChange={(e) => setImage(e.target.files[0])} 
              />
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="post-header">
              <span className="truck-icon me-2" style={{ fontSize: "2rem" }}>{getTruckIcon(post.truckType)}</span>
              <div>
                <h5 className="card-title mb-1 fw-bold">{post.origin} to {post.destination}</h5>
                <p className="text-muted mb-0">
                  <small>Posted on {new Date(post.createdAt || Date.now()).toLocaleDateString()}</small>
                </p>
              </div>
            </div>
            
            <hr className="my-3" />
            
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-2">
                  <div className="me-2" style={{width: "30px", textAlign: "center"}}>🚚</div>
                  <div>
                    <strong>Truck Type:</strong> {post.truckType.charAt(0).toUpperCase() + post.truckType.slice(1)}
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="me-2" style={{width: "30px", textAlign: "center"}}>⚖️</div>
                  <div>
                    <strong>Max Weight:</strong> {post.maxWeight} kg
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="me-2" style={{width: "30px", textAlign: "center"}}>🗓️</div>
                  <div>
                    <strong>Departure:</strong> {new Date(post.departureDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="me-2" style={{width: "30px", textAlign: "center"}}>📱</div>
                  <div>
                    <strong>Contact:</strong> {post.phoneNumber}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                {post.imageUrl && (
                  <div className="truck-image-container mb-3">
                    <img 
                      src={post.imageUrl} 
                      alt="Truck" 
                      className="img-fluid rounded" 
                      style={{maxHeight: '200px', width: '100%', objectFit: 'cover'}} 
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="map-container mt-3 mb-3">
              <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={8}
                center={{ lat: -6.2088, lng: 106.8456 }}
              >
                <Marker position={{ lat: -6.2088, lng: 106.8456 }} />
              </GoogleMap>
            </div>
            
            {user?.role === 'driver' && user.id === post.driverId && (
              <div className="d-flex justify-content-end mt-3">
                <button 
                  className="btn btn-primary me-2"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-pencil me-1"></i> Edit
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this post?')) {
                      dispatch(deletePost(post.id));
                    }
                  }}
                >
                  <i className="bi bi-trash me-1"></i> Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;