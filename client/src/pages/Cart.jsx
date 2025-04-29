import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router"; 
import api from "../utils/api";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data } = await api.get("/carts");
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to load your cart. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleRemoveItem = async (id) => {
    try {
      await api.delete(`/carts/${id}`);
      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item from cart");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.Lecture.price, 0);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <i className="bi bi-cart-x fs-1 text-secondary mb-3"></i>
          <h3>Your cart is empty</h3>
          <p className="text-muted mb-4">Looks like you haven't added any courses yet.</p>
          <Link to="/courses" className="btn btn-primary">
            Explore Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Shopping Cart</h1>
      
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">{cartItems.length} Courses in Cart</h5>
              
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex mb-4 pb-4 border-bottom">
                  <img
                    src={item.Lecture.image || "https://via.placeholder.com/150x100?text=Course"}
                    alt={item.Lecture.name}
                    className="rounded me-3"
                    width="150"
                    height="100"
                    style={{ objectFit: "cover" }}
                  />
                  
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h5>{item.Lecture.name}</h5>
                      <h5 className="text-primary">{formatToIDR(item.Lecture.price)}</h5>
                    </div>
                    
                    <p className="text-muted mb-2">{item.Lecture.technique}</p>
                    
                    <div>
                      <span className="badge bg-secondary me-2">
                        {item.Lecture.category?.name || "General"}
                      </span>
                      <span className="small text-muted">
                        <i className="bi bi-person-fill me-1"></i>
                        {item.Lecture.instructor || "Expert Instructor"}
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Remove
                      </button>
                      
                      <Link 
                        to={`/lectures/${item.LectureId}`} 
                        className="btn btn-sm btn-link text-decoration-none ms-2"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Order Summary</h5>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span className="fw-bold">{formatToIDR(calculateTotal())}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Discount:</span>
                <span>{formatToIDR(0)}</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold text-primary">{formatToIDR(calculateTotal())}</span>
              </div>
              
              <button 
                className="btn btn-primary w-100 py-2"
                onClick={handleCheckout}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
              
              <hr className="my-4" />
              
              <div className="mb-3">
                <label htmlFor="couponCode" className="form-label">Apply Coupon Code</label>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="couponCode" 
                    placeholder="Enter code"
                  />
                  <button className="btn btn-outline-secondary">Apply</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Need Help?</h5>
              <p className="text-muted small mb-0">
                If you have questions about your order, please contact our support team.
              </p>
              <div className="mt-3">
                <a href="#" className="btn btn-sm btn-link text-decoration-none p-0">
                  <i className="bi bi-chat-left-text me-1"></i>
                  Chat with Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}