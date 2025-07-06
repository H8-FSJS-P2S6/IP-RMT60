import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCart,
  removeFromCart,
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectCartTotal,
  clearCartError,
} from "../store/slices/cartSlice";
import { showCartToast } from "../utils/toast";
import { formatToIDR } from "../utils/formatter";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const loading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const totalAmount = useAppSelector(selectCartTotal);

  useEffect(() => {
    const loadCart = async () => {
      await dispatch(fetchCart());
    };

    loadCart();
  }, [dispatch]);

  const handleRemoveItem = async (id) => {
    try {
      // Make sure we have a valid ID
      if (!id) {
        console.error("Invalid item ID:", id);
        showCartToast.error("Cannot remove item: Invalid ID");
        return;
      }

      console.log("Removing item ID:", id, typeof id); // Debug info with type
      const action = await dispatch(removeFromCart(id));

      if (removeFromCart.fulfilled.match(action)) {
        showCartToast.itemRemoved();
      } else {
        console.error("Failed to remove item:", action.payload);
        showCartToast.error(action.payload || "Error removing item");
      }
    } catch (err) {
      console.error("Exception in removeFromCart:", err);
      showCartToast.error("An unexpected error occurred");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showCartToast.empty();
      return;
    }
    navigate("/checkout");
  };

  const handleRetry = () => {
    dispatch(clearCartError());
    dispatch(fetchCart());
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
          <button className="btn btn-link ms-2" onClick={handleRetry}>
            Try Again
          </button>
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
          <p className="text-muted mb-4">
            Looks like you haven't added any courses yet.
          </p>
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
              <h5 className="card-title mb-4">
                {cartItems.length} Courses in Cart
              </h5>

              {cartItems.map((item) => (
                <div
                  key={`cart-${item.LectureId}`}
                  className="d-flex mb-4 pb-4 border-bottom"
                >
                  <img
                    src={
                      item.Lecture?.image ||
                      "https://via.placeholder.com/150x100?text=Course"
                    }
                    alt={item.Lecture?.name || "Course"}
                    className="rounded me-3"
                    width="150"
                    height="100"
                    style={{ objectFit: "cover" }}
                  />

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <h5>{item.Lecture?.name || "Unknown Course"}</h5>
                      <h5 className="text-primary">
                        {formatToIDR(item.Lecture?.price || 0)}
                      </h5>
                    </div>

                    <p className="text-muted mb-2">
                      {item.Lecture?.technique || "Unknown Technique"}
                    </p>

                    <div>
                      <span className="badge bg-secondary me-2">
                        {item.Lecture?.category?.name || "General"}
                      </span>
                      <span className="small text-muted">
                        <i className="bi bi-person-fill me-1"></i>
                        {item.Lecture?.title || "Expert Instructor"}
                      </span>
                    </div>

                    <div className="mt-3">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          // Use the LectureId instead of id which doesn't exist
                          handleRemoveItem(item.LectureId);
                        }}
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
                <span className="fw-bold">{formatToIDR(totalAmount)}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Discount:</span>
                <span>{formatToIDR(0)}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total:</span>
                <span className="fw-bold text-primary">
                  {formatToIDR(totalAmount)}
                </span>
              </div>

              <button
                className="btn btn-primary w-100 py-2"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">Need Help?</h5>
              <p className="text-muted small mb-0">
                If you have questions about your order, please contact our
                support team.
              </p>
              <div className="mt-3">
                <Link
                  to="/chatbot"
                  className="btn btn-sm btn-link text-decoration-none p-0"
                >
                  <i className="bi bi-chat-left-text me-1"></i>
                  Chat with Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
