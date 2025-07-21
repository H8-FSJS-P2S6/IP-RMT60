import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchTransactionStatus,
  selectCurrentTransaction,
  selectTransactionLoading,
  selectTransactionError,
} from '../store/slices/transactionSlice';

const formatToIDR = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
};

export default function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const transaction = useAppSelector(selectCurrentTransaction);
  const loading = useAppSelector(selectTransactionLoading);
  const error = useAppSelector(selectTransactionError);

  // Get query params
  const params = new URLSearchParams(location.search);
  const orderId = params.get('order_id');
  const status = location.pathname.split('/').pop(); // success, failed, or pending

  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
    dispatch(fetchTransactionStatus(orderId));
  }, [orderId, navigate, dispatch]);

  const getStatusDetails = () => {
    switch (status) {
      case 'success':
        return {
          title: 'Payment Successful!',
          message: 'Thank you for your purchase. You can now access your courses.',
          icon: 'bi-check-circle-fill text-success',
          variant: 'success',
        };
      case 'pending':
        return {
          title: 'Payment is Processing',
          message: "Your payment is being processed. We'll notify you once it's complete.",
          icon: 'bi-hourglass-split text-warning',
          variant: 'warning',
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          message: 'Sorry, your payment could not be processed. Please try again.',
          icon: 'bi-x-circle-fill text-danger',
          variant: 'danger',
        };
      default:
        return {
          title: 'Payment Status',
          message: "Here's the status of your payment.",
          icon: 'bi-info-circle-fill text-info',
          variant: 'info',
        };
    }
  };

  const statusDetails = getStatusDetails();

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Retrieving your payment information...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className={`card border-${statusDetails.variant} mb-4`}>
        <div className={`card-header bg-${statusDetails.variant} bg-opacity-10 d-flex align-items-center`}>
          <i className={`bi ${statusDetails.icon} fs-1 me-3`}></i>
          <div>
            <h2 className="card-title mb-0">{statusDetails.title}</h2>
            <p className="card-text mb-0">{statusDetails.message}</p>
          </div>
        </div>

        {transaction && (
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <h5>Payment Details</h5>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td>Invoice Number</td>
                      <td>: {transaction.invoice_number}</td>
                    </tr>
                    <tr>
                      <td>Date</td>
                      <td>: {new Date(transaction.createdAt).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Total Amount</td>
                      <td>: {formatToIDR(transaction.total_amount)}</td>
                    </tr>
                    <tr>
                      <td>Payment Method</td>
                      <td>: {transaction.payment_method}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td>
                        :{' '}
                        <span
                          className={`badge bg-${
                            transaction.status === 'Completed'
                              ? 'success'
                              : transaction.status === 'Pending'
                              ? 'warning'
                              : transaction.status === 'Cancelled'
                              ? 'danger'
                              : 'secondary'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="col-md-6">
                <h5>Purchased Courses</h5>
                {transaction.TransactionDetails?.length > 0 ? (
                  <div className="list-group">
                    {transaction.TransactionDetails.map((detail) => (
                      <div key={detail.id} className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{detail.Lecture?.name}</h6>
                          <span>{formatToIDR(detail.price)}</span>
                        </div>
                        <p className="mb-1">{detail.Lecture?.technique}</p>
                        {transaction.status === 'Completed' && (
                          <small>
                            <Link to={`/courses/${detail.LectureId}`}>View Course</Link>
                          </small>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No course details available</p>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3">
              <Link to="/" className="btn btn-outline-primary">
                <i className="bi bi-house-door me-1"></i> Go to Home
              </Link>
              <Link to="/courses" className="btn btn-primary">
                <i className="bi bi-book me-1"></i> Browse More Courses
              </Link>
              {transaction.status === 'Pending' && (
                <a
                  href={`https://dashboard.sandbox.midtrans.com/payments/search?search=${transaction.invoice_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-warning"
                >
                  <i className="bi bi-credit-card me-1"></i> Complete Payment
                </a>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="card-body">
            <div className="alert alert-danger">{error}</div>
            <div className="d-flex justify-content-center">
              <Link to="/" className="btn btn-primary">
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}