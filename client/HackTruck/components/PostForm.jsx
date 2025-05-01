import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../store/slices/postSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PostForm = () => {
  const dispatch = useDispatch();
  const { user, error: authError } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    departureDate: '',
    origin: '',
    destination: '',
    truckType: 'pickup',
    maxWeight: '',
    phoneNumber: '',
    price: '',
    mapEmbedUrl: '',
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [image, setImage] = useState(null);
  const [postError, setPostError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPostError(null);
    const data = new FormData();

    // Format the date before submitting
    const formattedData = {
      ...formData,
      departureDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    };

    Object.keys(formattedData).forEach(key => data.append(key, formattedData[key]));
    if (image) data.append('image', image);

    try {
      await dispatch(createPost(data)).unwrap();
      setFormData({
        departureDate: '',
        origin: '',
        destination: '',
        truckType: 'pickup',
        maxWeight: '',
        phoneNumber: '',
        price: '',
        mapEmbedUrl: '',
      });
      setSelectedDate(null);
      setImage(null);
    } catch (err) {
      setPostError(err.message || 'Failed to create post');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setFormData({ ...formData, departureDate: formattedDate });
    } else {
      setFormData({ ...formData, departureDate: '' });
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
    },
  };

  // Don't render the form if user is not logged in or is not a driver
  if (!user || user.role !== 'driver') {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4">
      {(authError || postError) && (
        <div className="alert alert-danger mb-3">
          {authError || postError}
        </div>
      )}
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
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
              {
                name: 'preventOverflow',
                options: {
                  rootBoundary: 'viewport',
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
        <label className="form-label">Price (Rp)</label>
        <input
          type="number"
          className="form-control"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g., 500000"
          required
        />
        <small className="text-muted">Enter price in Indonesian Rupiah (IDR)</small>
      </div>
      <div className="mb-3">
        <label className="form-label">Map Embed URL</label>
        <input
          type="text"
          className="form-control"
          name="mapEmbedUrl"
          value={formData.mapEmbedUrl}
          onChange={handleChange}
          placeholder="https://www.google.com/maps/embed?..."
        />
        <small className="text-muted">
          Paste Google Maps embed URL (optional). Get it from Google Maps by selecting
          your route, clicking Share, and choosing Embed a map.
        </small>
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
      <button type="submit" className="btn btn-primary">
        Create Post
      </button>
    </form>
  );
};

export default PostForm;