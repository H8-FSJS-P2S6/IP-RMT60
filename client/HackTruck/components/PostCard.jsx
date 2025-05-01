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
    width: "100%"
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);
    
    dispatch(updatePost({ id: post.id, postData: data }));
    setIsEditing(false);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
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
              <input 
                type="file" 
                className="form-control" 
                onChange={(e) => setImage(e.target.files[0])} 
              />
            </div>
            <button type="submit" className="btn btn-primary me-2">Save</button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h5 className="card-title">{post.origin} to {post.destination}</h5>
            <p className="card-text">
              Truck Type: {post.truckType}<br />
              Max Weight: {post.maxWeight} kg<br />
              Departure: {new Date(post.departureDate).toLocaleDateString()}<br />
              Contact: {post.phoneNumber}
            </p>
            {post.imageUrl && <img src={post.imageUrl} alt="Truck" className="img-fluid mb-2" style={{maxHeight: '200px'}} />}
            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={8}
              center={{ lat: -6.2088, lng: 106.8456 }}
            >
              <Marker position={{ lat: -6.2088, lng: 106.8456 }} />
            </GoogleMap>
            {user?.role === 'driver' && user.id === post.driverId && (
              <div className="mt-2">
                <button 
                  className="btn btn-primary me-2"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => dispatch(deletePost(post.id))}
                >
                  Delete
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