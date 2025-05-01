import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../store/slices/postSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PostForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    departureDate: '',
    origin: '',
    destination: '',
    truckType: 'pickup',
    maxWeight: '',
    phoneNumber: '',
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Format the date before submitting
    const formattedData = {
      ...formData,
      departureDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    };
    
    Object.keys(formattedData).forEach(key => data.append(key, formattedData[key]));
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
    setSelectedDate(null);
    setImage(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setFormData({ ...formData, departureDate: formattedDate });
    }
  };

  const datePickerStyles = {
    container: {
      width: '100%',
    },
    datePickerInput: {
      width: '100%',
      padding: '0.375rem 0.75rem', 
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#212529',
      backgroundColor: '#fff',
      backgroundClip: 'padding-box',
      border: '1px solid #ced4da',
      borderRadius: '0.25rem',
      transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      height: 'calc(1.5em + 0.75rem + 2px)',
    }
  };

  // Don't render the form if user is not logged in or is not a driver
  if (!user || user.role !== 'driver') {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4">
      <div className="mb-3">
        <label className="form-label">Departure Date</label>
        <div style={datePickerStyles.container}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            style={datePickerStyles.datePickerInput}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select departure date"
            minDate={new Date()}
            required
            isClearable
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={5}
            popperPlacement="bottom-start"
            popperModifiers={[
              {
                name: "offset",
                options: {
                  offset: [0, 8],
                },
              },
              {
                name: "preventOverflow",
                options: {
                  rootBoundary: "viewport",
                  tether: false,
                  altAxis: true,
                },
              },
            ]}
          />
        </div>
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