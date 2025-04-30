import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminPayments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
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
      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions");
      toast.error("Failed to load payment data");
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
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/transactions/${id}/status`, { status: newStatus });
      setTransactions(transactions.map(t => 
        t.id === id ? { ...t, status: newStatus } : t
      ));
      toast.success(`Payment status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update payment status");
    }
  };
  
  const fetchTransactionDetails = async (id) => {
    try {
      const { data } = await api.get(`/admin/transactions/${id}`);
      setSelectedTransaction(data);
      const modal = new window.bootstrap.Modal(document.getElementById('transactionDetailModal'));
      modal.show();
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      toast.error("Failed to load transaction details");
    }
  };
  
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
    <>
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="mt-4">Payment Transactions</h1>
          <button 
            className="btn btn-sm btn-outline-secondary mt-4"
            onClick={() => fetchTransactions()}
          >
            <i className="fas fa-sync me-1"></i> Refresh
          </button>
        </div>
        
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <div><i className="fas fa-credit-card me-1"></i> Payment List</div>
            <div className="d-flex gap-2">
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
                  <thead className="table-light">
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
                            <div className="d-flex gap-1">
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => fetchTransactionDetails(transaction.id)}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              
                              <div className="dropdown">
                                <button className="btn btn-sm btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                  Status
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button 
                                      className="dropdown-item" 
                                      onClick={() => handleStatusChange(transaction.id, 'Pending')}
                                      disabled={transaction.status === 'Pending'}
                                    >
                                      Pending
                                    </button>
                                  </li>
                                  <li>
                                    <button 
                                      className="dropdown-item" 
                                      onClick={() => handleStatusChange(transaction.id, 'Processing')}
                                      disabled={transaction.status === 'Processing'}
                                    >
                                      Processing
                                    </button>
                                  </li>
                                  <li>
                                    <button 
                                      className="dropdown-item" 
                                      onClick={() => handleStatusChange(transaction.id, 'Completed')}
                                      disabled={transaction.status === 'Completed'}
                                    >
                                      Completed
                                    </button>
                                  </li>
                                  <li>
                                    <button 
                                      className="dropdown-item text-danger" 
                                      onClick={() => handleStatusChange(transaction.id, 'Cancelled')}
                                      disabled={transaction.status === 'Cancelled'}
                                    >
                                      Cancelled
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
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
      
      <div className="modal fade" id="transactionDetailModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Transaction Detail</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedTransaction ? (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6>Transaction Information</h6>
                      <table className="table table-borderless table-sm">
                        <tbody>
                          <tr>
                            <td>Invoice Number</td>
                            <td>: {selectedTransaction.invoice_number}</td>
                          </tr>
                          <tr>
                            <td>Date</td>
                            <td>: {new Date(selectedTransaction.createdAt).toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td>Total Amount</td>
                            <td>: {formatToIDR(selectedTransaction.total_amount)}</td>
                          </tr>
                          <tr>
                            <td>Payment Method</td>
                            <td>: {selectedTransaction.payment_method}</td>
                          </tr>
                          <tr>
                            <td>Status</td>
                            <td>
                              : <span className={`badge ${getStatusBadgeClass(selectedTransaction.status)}`}>
                                {selectedTransaction.status}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-6">
                      <h6>Customer Information</h6>
                      <table className="table table-borderless table-sm">
                        <tbody>
                          <tr>
                            <td>Name</td>
                            <td>: {selectedTransaction.User?.username}</td>
                          </tr>
                          <tr>
                            <td>Email</td>
                            <td>: {selectedTransaction.User?.email}</td>
                          </tr>
                          <tr>
                            <td>Phone</td>
                            <td>: {selectedTransaction.User?.phoneNumber || '-'}</td>
                          </tr>
                          <tr>
                            <td>Address</td>
                            <td>: {selectedTransaction.User?.address || '-'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <h6>Purchased Courses</h6>
                  <table className="table table-bordered table-striped">
                    <thead className="table-light">
                      <tr>
                        <th>Course</th>
                        <th>Technique</th>
                        <th>Category</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTransaction.TransactionDetails?.map(detail => (
                        <tr key={detail.id}>
                          <td>{detail.Lecture?.name}</td>
                          <td>{detail.Lecture?.technique}</td>
                          <td>{detail.Lecture?.category?.name}</td>
                          <td>{formatToIDR(detail.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan="3" className="text-end">Total</th>
                        <th>{formatToIDR(selectedTransaction.total_amount)}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              {selectedTransaction && (
                <div className="dropdown">
                  <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Update Status
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={() => handleStatusChange(selectedTransaction.id, 'Processing')}
                        disabled={selectedTransaction.status === 'Processing'}
                      >
                        Mark as Processing
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item" 
                        onClick={() => handleStatusChange(selectedTransaction.id, 'Completed')}
                        disabled={selectedTransaction.status === 'Completed'}
                      >
                        Mark as Completed
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={() => handleStatusChange(selectedTransaction.id, 'Cancelled')}
                        disabled={selectedTransaction.status === 'Cancelled'}
                      >
                        Mark as Cancelled
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}