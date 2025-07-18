import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchTransactions, 
  selectTransactions, 
  selectTransactionLoading, 
  selectTransactionError 
} from '../store/slices/transactionSlice';

const formatToIDR = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const getStatusBadge = (status) => {
  const statusConfig = {
    'Pending': { class: 'bg-warning text-dark', text: 'Pending Payment' },
    'Processing': { class: 'bg-info text-white', text: 'Processing' },
    'Completed': { class: 'bg-success text-white', text: 'Completed' },
    'Cancelled': { class: 'bg-danger text-white', text: 'Cancelled' },
    'Refunded': { class: 'bg-secondary text-white', text: 'Refunded' },
  };
  
  const config = statusConfig[status] || { class: 'bg-secondary text-white', text: status };
  return (
    <span className={`badge ${config.class}`}>
      {config.text}
    </span>
  );
};

const getPaymentMethodBadge = (method) => {
  const methodConfig = {
    'Manual_Transfer': { class: 'bg-primary text-white', text: 'Manual Transfer', icon: 'bi-bank' },
    'Midtrans': { class: 'bg-success text-white', text: 'Payment Gateway', icon: 'bi-credit-card' },
  };
  
  const config = methodConfig[method] || { class: 'bg-secondary text-white', text: method, icon: 'bi-question-circle' };
  return (
    <span className={`badge ${config.class}`}>
      <i className={`${config.icon} me-1`}></i>
      {config.text}
    </span>
  );
};

export default function UserOrders() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectTransactions);
  const loading = useAppSelector(selectTransactionLoading);
  const error = useAppSelector(selectTransactionError);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions({ status: selectedStatus }));
  }, [dispatch, selectedStatus]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };

  const generateWhatsAppMessage = (transaction) => {
    const message = `Hello, I would like to inquire about the payment status for:
    
📝 Invoice: ${transaction.invoice_number}
💰 Total: ${formatToIDR(transaction.total_amount)}
📅 Date: ${new Date(transaction.createdAt).toLocaleDateString('en-US')}

Thank you.`;
    
    return `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
  };

  if (loading) {
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

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>My Orders</h2>
            <div className="dropdown">
              <button 
                className="btn btn-outline-secondary dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown"
              >
                {selectedStatus ? getStatusBadge(selectedStatus) : 'All Status'}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleStatusFilter('')}
                  >
                    All Status
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleStatusFilter('Pending')}
                  >
                    Pending Payment
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleStatusFilter('Processing')}
                  >
                    Processing
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => handleStatusFilter('Completed')}
                  >
                    Completed
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {transactions.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="bi bi-receipt-cutoff display-1 text-muted mb-3"></i>
                <h4>No Orders Yet</h4>
                <p className="text-muted">You don't have any orders yet.</p>
                <a href="/courses" className="btn btn-primary">
                  Explore Courses
                </a>
              </div>
            </div>
          ) : (
            <div className="row">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="col-lg-6 mb-4">
                  <div className="card h-100">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <strong>Invoice:</strong> {transaction.invoice_number}
                      </small>
                      <small className="text-muted">
                        {new Date(transaction.createdAt).toLocaleDateString('en-US')}
                      </small>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-6">
                          {getStatusBadge(transaction.status)}
                        </div>
                        <div className="col-6 text-end">
                          {getPaymentMethodBadge(transaction.payment_method)}
                        </div>
                      </div>
                      
                      <h5 className="card-title">
                        {formatToIDR(transaction.total_amount)}
                      </h5>
                      
                      {transaction.TransactionDetails && transaction.TransactionDetails.length > 0 && (
                        <div className="mb-3">
                          <strong>Kursus:</strong>
                          <ul className="list-unstyled mb-0 mt-1">
                            {transaction.TransactionDetails.map((detail, index) => (
                              <li key={index} className="small text-muted">
                                • {detail.Lecture?.name || 'Unknown Course'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="card-footer">
                      {transaction.status === 'Pending' && transaction.payment_method === 'Manual_Transfer' && (
                        <div className="d-grid gap-2">
                          <a 
                            href={generateWhatsAppMessage(transaction)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-sm"
                          >
                            <i className="bi bi-whatsapp me-2"></i>
                            Confirm Payment
                          </a>
                          <small className="text-muted text-center">
                            Send transfer proof via WhatsApp
                          </small>
                        </div>
                      )}
                      
                      {transaction.status === 'Completed' && (
                        <div className="text-center">
                          <a 
                            href="/courses" 
                            className="btn btn-primary btn-sm"
                          >
                            <i className="bi bi-play-circle me-2"></i>
                            Mulai Belajar
                          </a>
                        </div>
                      )}
                      
                      {transaction.status === 'Processing' && (
                        <div className="text-center">
                          <small className="text-info">
                            <i className="bi bi-clock me-1"></i>
                            Payment is being verified
                          </small>
                        </div>
                      )}
                      
                      {transaction.status === 'Cancelled' && (
                        <div className="text-center">
                          <small className="text-danger">
                            <i className="bi bi-x-circle me-1"></i>
                            Order cancelled
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
