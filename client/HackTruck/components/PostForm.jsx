import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPost } from '../store/slices/postSlice';

const PostForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    departureDate: '',
    origin: '',
    destination: '',
    truckType: 'pickup',
    maxWeight: '',
    phoneNumber: '',
  });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);
    
    dispatch(createPost(data));
    setFormData({
      departureDate: '',
      origin: '',
      destination: '',
      truckType: 'pickup',
      maxWeight: '',
      phoneNumber: '',
    });
    setImage(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4">
      <div className="mb-3">
        <label className="form-label">Departure Date</label>
        <input 
          type="date" 
          className="form-control" 
          name="departureDate" 
          value={formData.departureDate} 
          onChange={handleChange} 
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
          onChange={handleChange} 
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
          onChange={handleChange} 
          required 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Truck Type</label>
        <select 
          className="form-control" 
          name="truckType" 
          value={formData.truckType} 
          onChange={handleChange}
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
          onChange={handleChange} 
          required 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Phone Number</label>
        <input 
          type="tel" 
          className="form-control" 
          name="phoneNumber" 
          value={formData.phoneNumber} 
          onChange={handleChange} 
          required 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Image</label>
        <input 
          type="file" 
          className="form-control" 
          onChange={(e) => setImage(e.target.files[0])} 
        />
      </div>
      <button type="submit" className="btn btn-primary">Create Post</button>
    </form>
  );
};

export default PostForm;