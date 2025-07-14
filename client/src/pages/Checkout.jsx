import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchCart,
  selectCartItems,
  selectCartLoading,
  selectCartError,
  selectCartTotal,
} from '../store/slices/cartSlice';
import {
  createPayment,
  selectTransactionLoading,
  selectTransactionError,
  selectPaymentRedirect,
  resetPaymentStatus,
} from '../store/slices/transactionSlice';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartLoading = useAppSelector(selectCartLoading);
  const cartError = useAppSelector(selectCartError);
  const totalAmount = useAppSelector(selectCartTotal);
  const transactionLoading = useAppSelector(selectTransactionLoading);
  const transactionError = useAppSelector(selectTransactionError);
  const paymentRedirect = useAppSelector(selectPaymentRedirect);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (paymentRedirect) {
      window.location.href = paymentRedirect;
      dispatch(resetPaymentStatus());
    }
  }, [paymentRedirect, dispatch]);

  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = async () => {
    try {
      const response = await dispatch(createPayment()).unwrap();
      if (response.payment.token) {
        window.snap.pay(response.payment.token, {
          onSuccess: () =>
            navigate(`/payment/success?order_id=${response.transaction.invoice_number}`),
          onPending: () =>
            navigate(`/payment/pending?order_id=${response.transaction.invoice_number}`),
          onError: () =>
            navigate(`/payment/failed?order_id=${response.transaction.invoice_number}`),
          onClose: () => {
            alert('You closed the payment window. Please complete your payment to access the courses.');
          },
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  if (cartLoading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="card">
          <div className="card-body text-center">
            <h2>Your cart is empty</h2>
            <p>Please add courses to your cart before checkout</p>
            <button className="btn btn-primary" onClick={() => navigate('/courses')}>
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col">Course</th>
                    <th scope="col" className="text-end">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div>
                          <h6>{item.Lecture.name}</h6>
                          <p className="text-muted mb-0">{item.Lecture.technique}</p>
                          <small className="text-muted">{item.Lecture.category?.name}</small>
                        </div>
                      </td>
                      <td className="text-end">{formatToIDR(item.Lecture.price)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th className="text-end">{formatToIDR(totalAmount)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Payment</h5>
            </div>
            <div className="card-body">
              <p>Click the button below to proceed with payment through Midtrans secure payment gateway.</p>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handlePayment}
                  disabled={transactionLoading}
                >
                  {transactionLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Processing...
                    </>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>
              {(cartError || transactionError) && (
                <div className="alert alert-danger mt-3">
                  {cartError || transactionError}
                </div>
              )}
              <div className="mt-3">
                <small className="text-muted">
                  By clicking "Pay Now", you will be redirected to Midtrans secure payment page.
                </small>
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-body">
              <h6>Accepted Payment Methods</h6>
              <div className="d-flex flex-wrap gap-2 mt-2">
                <img src="https://midtrans.com/assets/images/logo-bca.svg" alt="BCA" height="24" />
                <img src="https://midtrans.com/assets/images/logo-mandiri.svg" alt="Mandiri" height="24" />
                <img src="https://midtrans.com/assets/images/logo-bni.svg" alt="BNI" height="24" />
                <img src="https://midtrans.com/assets/images/logo-bri.svg" alt="BRI" height="24" />
                <img src="https://midtrans.com/assets/images/logo-gopay.svg" alt="GoPay" height="24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}