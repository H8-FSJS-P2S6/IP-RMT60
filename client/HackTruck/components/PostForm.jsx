import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../store/slices/postSlice';

const PostForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.posts);
  
  const [formData, setFormData] = useState({
    departureDate: '',
    origin: '',
    destination: '',
    truckType: 'pickup',
    maxWeight: '',
    price: '',
    mapEmbedUrl: '',
    phoneNumber: '',
    image: null,
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.departureDate) errors.departureDate = 'Departure date is required';
    if (!formData.origin) errors.origin = 'Origin is required';
    if (!formData.destination) errors.destination = 'Destination is required';
    if (!formData.truckType) errors.truckType = 'Truck type is required';
    if (!formData.maxWeight || formData.maxWeight <= 0) errors.maxWeight = 'Valid max weight is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const postData = new FormData();
        postData.append('departureDate', formData.departureDate);
        postData.append('origin', formData.origin);
        postData.append('destination', formData.destination);
        postData.append('truckType', formData.truckType);
        postData.append('maxWeight', formData.maxWeight);
        postData.append('price', formData.price);
        if (formData.mapEmbedUrl) postData.append('mapEmbedUrl', formData.mapEmbedUrl);
        if (formData.phoneNumber) postData.append('phoneNumber', formData.phoneNumber);
        if (formData.image) postData.append('image', formData.image);

        await dispatch(createPost(postData)).unwrap();
        // Reset form on success
        setFormData({
          departureDate: '',
          origin: '',
          destination: '',
          truckType: 'pickup',
          maxWeight: '',
          price: '',
          mapEmbedUrl: '',
          phoneNumber: '',
          image: null,
        });
        setFormErrors({});
      } catch (err) {
        console.error('Post creation failed:', err);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      {error && (
        <div className="alert alert-danger mb-4 text-center">
          {error}
        </div>
      )}
      <div className="mb-3">
        <label className="form-label">Departure Date</label>
        <input
          type="date"
          className={`form-control ${formErrors.departureDate ? 'is-invalid' : ''}`}
          value={formData.departureDate}
          onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
        />
        {formErrors.departureDate && <div className="invalid-feedback">{formErrors.departureDate}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Origin</label>
        <input
          type="text"
          className={`form-control ${formErrors.origin ? 'is-invalid' : ''}`}
          placeholder="Enter origin"
          value={formData.origin}
          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
        />
        {formErrors.origin && <div className="invalid-feedback">{formErrors.origin}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Destination</label>
        <input
          type="text"
          className={`form-control ${formErrors.destination ? 'is-invalid' : ''}`}
          placeholder="Enter destination"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
        />
        {formErrors.destination && <div className="invalid-feedback">{formErrors.destination}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Truck Type</label>
        <select
          className={`form-control ${formErrors.truckType ? 'is-invalid' : ''}`}
          value={formData.truckType}
          onChange={(e) => setFormData({ ...formData, truckType: e.target.value })}
        >
          <option value="pickup">Pickup</option>
          <option value="box">Box</option>
          <option value="flatbed">Flatbed</option>
          <option value="refrigerated">Refrigerated</option>
        </select>
        {formErrors.truckType && <div className="invalid-feedback">{formErrors.truckType}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Max Weight (kg)</label>
        <input
          type="number"
          className={`form-control ${formErrors.maxWeight ? 'is-invalid' : ''}`}
          placeholder="Enter max weight in kg"
          value={formData.maxWeight}
          onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
        />
        {formErrors.maxWeight && <div className="invalid-feedback">{formErrors.maxWeight}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Price (Rp)</label>
        <input
          type="number"
          className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
          placeholder="e.g. 500000"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <small className="form-text text-muted">Enter price in Indonesian Rupiah (IDR)</small>
        {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Map Embed URL</label>
        <input
          type="url"
          className="form-control"
          placeholder="Paste Google Maps embed URL (optional)"
          value={formData.mapEmbedUrl}
          onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
        />
        <small className="form-text text-muted">
          Paste Google Maps embed URL (optional). Get it from Google Maps by selecting your route, clicking Share, and choosing Embed a map.
        </small>
      </div>

      <div className="mb-3">
        <label className="form-label">Phone Number</label>
        <input
          type="tel"
          className="form-control"
          placeholder="Enter phone number (optional)"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Image</label>
        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Creating Post...
          </>
        ) : (
          'Create Post'
        )}
      </button>
    </form>
  );
};

export default PostForm;