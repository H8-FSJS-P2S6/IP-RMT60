import React, { useState } from 'react';
import { getTruckRecommendation } from '../store/api';

// Fallback recommendations when the server API fails
const getFallbackRecommendation = (weight) => {
  if (weight <= 500) {
    return "Based on your cargo weight of " + weight + " kg, I recommend a pickup truck. Pickup trucks are ideal for lighter loads under 500 kg and provide good fuel efficiency while maintaining decent cargo capacity.";
  } else if (weight <= 2000) {
    return "For your cargo weight of " + weight + " kg, a box truck would be most suitable. Box trucks offer enclosed storage for medium-weight cargo (500-2000 kg) and provide protection from weather elements.";
  } else if (weight <= 10000) {
    return "With a cargo weight of " + weight + " kg, a flatbed truck is recommended. Flatbed trucks are designed for heavy loads (2000-10000 kg) and allow for easy loading and unloading of large items.";
  } else {
    return "For your heavy cargo weight of " + weight + " kg, you'll need a specialized heavy-duty truck or possibly multiple trucks. Please contact our logistics team for a customized solution.";
  }
};

const AiRecommendation = () => {
  const [weight, setWeight] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight || isNaN(weight) || weight <= 0) {
      setError('Please enter a valid weight in kg');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUsingFallback(false);
    
    try {
      const data = await getTruckRecommendation(Number(weight));
      setRecommendation(data.recommendation);
    } catch (err) {
      console.error("Error getting truck recommendation:", err);
      // Use fallback recommendation
      setUsingFallback(true);
      setRecommendation(getFallbackRecommendation(Number(weight)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-lg mb-4">
      <div className="card-header bg-primary bg-gradient text-white py-3">
        <h5 className="mb-0">
          <i className="bi bi-robot me-2"></i>
          AI Truck Recommendation
        </h5>
      </div>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="weightInput" className="form-label">
              How much cargo do you need to transport? (in kg)
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                id="weightInput"
                placeholder="Enter weight in kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="1"
              />
              <span className="input-group-text">kg</span>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Analyzing...
                  </>
                ) : (
                  'Get Recommendation'
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        {recommendation && (
          <div className="mt-4">
            <h6 className="mb-3">Our AI recommends:</h6>
            <div className="alert alert-success">
              {recommendation}
              {usingFallback && (
                <div className="mt-2 small text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  This is a local recommendation as our AI service is currently unavailable.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiRecommendation;