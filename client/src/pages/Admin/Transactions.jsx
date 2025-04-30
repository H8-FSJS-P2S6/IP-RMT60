import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../../utils/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  
  const formatToIDR = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };
  
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
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/admin/transactions/${id}/status`, { status: newStatus });
      // Update local state without refetching
      setTransactions(transactions.map(t => 
        t.id === id ? { ...t, status: newStatus } : t
      ));
    } catch (error) {
      console.error("Error updating transaction status:", error);
      alert("Failed to update transaction status");
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success';
      case 'Processing':
        return 'bg-info';
      case 'Cancelled':
        return 'bg-danger';
      default:
        return 'bg-warning';
    }
  };
  
  if (loading) {
    return (
      <div className="container-fluid px-4">
        <h1 className="mt-4">Transactions</h1>
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-fluid px-4">
        <h1 className="mt-4">Transactions</h1>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Transactions</h1>
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <i className="fas fa-table me-1"></i>
            Transaction List
          </div>
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
            </select>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
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
                      <td>{transaction.id}</td>
                      <td>{transaction.invoice_number}</td>
                      <td>{transaction.User?.username}</td>
                      <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                      <td>{formatToIDR(transaction.total_amount)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link to={`/admin/transactions/${transaction.id}`} className="btn btn-sm btn-info">
                            <i className="fas fa-eye"></i>
                          </Link>
                          
                          <div className="dropdown">
                            <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                              Update
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => handleStatusChange(transaction.id, 'Processing')}
                                  disabled={transaction.status === 'Processing' || transaction.status === 'Completed' || transaction.status === 'Cancelled'}
                                >
                                  Processing
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item" 
                                  onClick={() => handleStatusChange(transaction.id, 'Completed')}
                                  disabled={transaction.status === 'Completed' || transaction.status === 'Cancelled'}
                                >
                                  Completed
                                </button>
                              </li>
                              <li>
                                <button 
                                  className="dropdown-item text-danger" 
                                  onClick={() => handleStatusChange(transaction.id, 'Cancelled')}
                                  disabled={transaction.status === 'Completed' || transaction.status === 'Cancelled'}
                                >
                                  Cancel
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
          
          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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