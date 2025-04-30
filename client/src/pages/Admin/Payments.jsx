import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import api from '../../utils/api';

export default function AdminPayments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, statusFilter]);
  
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage);
      if (statusFilter) params.append("status", statusFilter);
      
      const { data } = await api.get(`/admin/transactions?${params}`);
      setTransactions(data.transactions);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };
  
  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success';
      case 'Processing':
        return 'bg-info';
      case 'Pending':
        return 'bg-warning';
      case 'Cancelled':
      case 'Failed':
        return 'bg-danger';
      case 'Refunded':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };
  
  // Additional functions would go here for transaction management
  
  if (loading && transactions.length === 0) {
    return (
      <div className="container-fluid px-4">
        <h1 className="mt-4">Payment Transactions</h1>
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Payment Transactions</h1>
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div><i className="fas fa-credit-card me-1"></i> Payment List</div>
          <div>
            <select 
              className="form-select form-select-sm" 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>
        <div className="card-body">
          {error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Method</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">No transactions found</td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.invoice_number}</td>
                        <td>{transaction.User?.username}</td>
                        <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                        <td>{formatToIDR(transaction.total_amount)}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td>{transaction.payment_method}</td>
                        <td>
                          <Link 
                            to={`/admin/payments/${transaction.id}`} 
                            className="btn btn-sm btn-info me-1"
                          >
                            <i className="fas fa-eye"></i> View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}