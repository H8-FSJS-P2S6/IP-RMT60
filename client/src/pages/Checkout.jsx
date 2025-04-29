import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: user?.address || "",
    paymentMethod: "bank_transfer"
  });

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const { data } = await api.get("/carts");
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError("Failed to load your cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      // Create order from cart
      const response = await api.post("/orders", {
        ...formData,
        items: cartItems.map(item => ({
          lectureId: item.LectureId,
          price: item.Lecture.price
        }))
      });
      
      // Redirect to success page with order ID
      navigate(`/checkout/success?orderId=${response.data.id}`);
      
    } catch (error) {
      console.error("Checkout error:", error);
      setError(error.response?.data?.message || "Failed to process your order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
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

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <i className="bi bi-cart-x fs-1 text-secondary mb-3"></i>
          <h3>Your cart is empty</h3>
          <p className="text-muted mb-4">You need to add courses to your cart before checkout.</p>
          <Link to="/courses" className="btn btn-primary">Explore Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Checkout</h1>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <div className="row g-5">
        <div className="col-md-7 col-lg-8">
          <h4 className="mb-3">Billing Details</h4>
          <form className="needs-validation" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="fullName" className="form-label">Full name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="fullName" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="email" 
                  name="email"
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="col-12">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="phone" 
                  name="phone"
                  placeholder="0812xxxxx" 
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label htmlFor="address" className="form-label">Address</label>
                <textarea 
                  className="form-control" 
                  id="address" 
                  name="address"
                  rows="3" 
                  placeholder="1234 Main St, Apartment, Suite, etc."
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            <hr className="my-4" />

            <h4 className="mb-3">Payment Method</h4>

            <div className="my-3">
              <div className="form-check">
                <input 
                  id="bank_transfer" 
                  name="paymentMethod" 
                  type="radio" 
                  className="form-check-input" 
                  value="bank_transfer"
                  checked={formData.paymentMethod === "bank_transfer"}
                  onChange={handleChange}
                  required 
                />
                <label className="form-check-label" htmlFor="bank_transfer">Bank Transfer</label>
              </div>
              
              <div className="form-check">
                <input 
                  id="credit_card" 
                  name="paymentMethod" 
                  type="radio" 
                  className="form-check-input" 
                  value="credit_card"
                  checked={formData.paymentMethod === "credit_card"}
                  onChange={handleChange}
                  required 
                />
                <label className="form-check-label" htmlFor="credit_card">Credit Card</label>
              </div>
              
              <div className="form-check">
                <input 
                  id="ewallet" 
                  name="paymentMethod" 
                  type="radio" 
                  className="form-check-input" 
                  value="ewallet"
                  checked={formData.paymentMethod === "ewallet"}
                  onChange={handleChange}
                  required 
                />
                <label className="form-check-label" htmlFor="ewallet">E-Wallet</label>
              </div>
            </div>
            
            {formData.paymentMethod === "credit_card" && (
              <div className="row gy-3">
                <div className="col-md-6">
                  <label htmlFor="cc-name" className="form-label">Name on card</label>
                  <input type="text" className="form-control" id="cc-name" placeholder="" />
                  <small className="text-muted">Full name as displayed on card</small>
                </div>

                <div className="col-md-6">
                  <label htmlFor="cc-number" className="form-label">Card number</label>
                  <input type="text" className="form-control" id="cc-number" placeholder="" />
                </div>

                <div className="col-md-3">
                  <label htmlFor="cc-expiration" className="form-label">Expiration</label>
                  <input type="text" className="form-control" id="cc-expiration" placeholder="" />
                </div>

                <div className="col-md-3">
                  <label htmlFor="cc-cvv" className="form-label">CVV</label>
                  <input type="text" className="form-control" id="cc-cvv" placeholder="" />
                </div>
              </div>
            )}

            <hr className="my-4" />

            <button 
              className="w-100 btn btn-primary btn-lg" 
              type="submit"
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                `Complete Order • ${formatToIDR(calculateTotal())}`
              )}
            </button>
          </form>
        </div>
        
        <div className="col-md-5 col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="my-0">Order Summary</h4>
            </div>
            <div className="card-body">
              <ul className="list-group mb-3">
                {cartItems.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                      <h6 className="my-0">{item.Lecture.name}</h6>
                      <small className="text-muted">{item.Lecture.technique}</small>
                    </div>
                    <span className="text-muted">{formatToIDR(item.Lecture.price)}</span>
                  </li>
                ))}
                
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total</span>
                  <strong>{formatToIDR(calculateTotal())}</strong>
                </li>
              </ul>
              
              <div className="mt-3">
                <Link to="/cart" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-arrow-left me-1"></i> Return to Cart
                </Link>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Why Choose Our Courses</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  Industry-recognized certifications
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  Expert instructors with real-world experience
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  Lifetime access to course materials
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-primary me-2"></i>
                  30-day money-back guarantee
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}