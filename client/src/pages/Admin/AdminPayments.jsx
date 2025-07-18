import { useEffect, useState } from 'react';
import api from '../../utils/api';

const formatToIDR = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const getStatusBadge = (status) => {
  const statusConfig = {
    'Pending': { class: 'warning', text: 'Pending Payment' },
    'Processing': { class: 'info', text: 'Processing' },
    'Completed': { class: 'success', text: 'Completed' },
    'Cancelled': { class: 'danger', text: 'Cancelled' },
  };
  
  const config = statusConfig[status] || { class: 'secondary', text: status };
  return (
    <span className={`badge bg-${config.class}`}>
      {config.text}
    </span>
  );
};

export default function AdminPayments() {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchPendingPayments();
    fetchPaymentStats();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/payments/pending');
      setPendingPayments(response.data.payments);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const response = await api.get('/admin/payments/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  const handleApprove = async (invoiceNumber) => {
    if (!window.confirm('Are you sure you want to approve this payment?')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [invoiceNumber]: 'approving' }));
      
      await api.patch(`/admin/payments/approve/${invoiceNumber}`, {
        note: 'Payment approved via admin dashboard'
      });
      
      // Refresh lists
      await fetchPendingPayments();
      await fetchPaymentStats();
      
      alert('Payment approved successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve payment');
    } finally {
      setActionLoading(prev => ({ ...prev, [invoiceNumber]: null }));
    }
  };

  const handleReject = async (invoiceNumber) => {
    const reason = window.prompt('Rejection reason:');
    if (!reason) return;

    try {
      setActionLoading(prev => ({ ...prev, [invoiceNumber]: 'rejecting' }));
      
      await api.patch(`/admin/payments/reject/${invoiceNumber}`, {
        reason
      });
      
      // Refresh lists
      await fetchPendingPayments();
      await fetchPaymentStats();
      
      alert('Payment rejected successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject payment');
    } finally {
      setActionLoading(prev => ({ ...prev, [invoiceNumber]: null }));
    }
  };

  const openWhatsApp = (userPhone, invoiceNumber) => {
    const message = `Hello! Regarding payment with invoice ${invoiceNumber}, please send transfer proof for verification. Thank you.`;
    const whatsappUrl = `https://wa.me/${userPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="bi bi-credit-card me-2"></i>
              Payment Management
            </h2>
            <button 
              className="btn btn-outline-primary"
              onClick={() => {
                fetchPendingPayments();
                fetchPaymentStats();
              }}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Payment Statistics */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-clock-history display-4 text-warning"></i>
                  <h5 className="card-title mt-2">Pending</h5>
                  <p className="card-text">
                    <strong>{stats.Pending?.count || 0}</strong> payments<br/>
                    <small className="text-muted">
                      {formatToIDR(stats.Pending?.total_amount || 0)}
                    </small>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-check-circle display-4 text-success"></i>
                  <h5 className="card-title mt-2">Completed</h5>
                  <p className="card-text">
                    <strong>{stats.Completed?.count || 0}</strong> payments<br/>
                    <small className="text-muted">
                      {formatToIDR(stats.Completed?.total_amount || 0)}
                    </small>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-gear display-4 text-info"></i>
                  <h5 className="card-title mt-2">Processing</h5>
                  <p className="card-text">
                    <strong>{stats.Processing?.count || 0}</strong> payments<br/>
                    <small className="text-muted">
                      {formatToIDR(stats.Processing?.total_amount || 0)}
                    </small>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <i className="bi bi-x-circle display-4 text-danger"></i>
                  <h5 className="card-title mt-2">Cancelled</h5>
                  <p className="card-text">
                    <strong>{stats.Cancelled?.count || 0}</strong> pembayaran<br/>
                    <small className="text-muted">
                      {formatToIDR(stats.Cancelled?.total_amount || 0)}
                    </small>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Payments Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-hourglass-split me-2"></i>
                Pending Payments ({pendingPayments.length})
              </h5>
            </div>
            <div className="card-body">
              {pendingPayments.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle display-1 text-success"></i>
                  <h4 className="mt-3">No Pending Payments</h4>
                  <p className="text-muted">All payments have been verified</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Invoice</th>
                        <th>User</th>
                        <th>Kursus</th>
                        <th>Amount</th>
                        <th>Tanggal</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingPayments.map(payment => (
                        <tr key={payment.id}>
                          <td>
                            <code>{payment.invoice_number}</code>
                          </td>
                          <td>
                            <div>
                              <strong>{payment.User.username}</strong><br/>
                              <small className="text-muted">{payment.User.email}</small>
                            </div>
                          </td>
                          <td>
                            <div>
                              {payment.TransactionDetails?.map((detail, index) => (
                                <div key={index} className="small">
                                  • {detail.Lecture?.name}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td>
                            <strong>{formatToIDR(payment.total_amount)}</strong>
                          </td>
                          <td>
                            <small>
                              {new Date(payment.createdAt).toLocaleDateString('id-ID')}<br/>
                              {new Date(payment.createdAt).toLocaleTimeString('id-ID')}
                            </small>
                          </td>
                          <td>
                            {getStatusBadge(payment.status)}
                          </td>
                          <td>
                            <div className="btn-group-vertical btn-group-sm">
                              <button 
                                className="btn btn-success btn-sm"
                                onClick={() => handleApprove(payment.invoice_number)}
                                disabled={actionLoading[payment.invoice_number]}
                              >
                                {actionLoading[payment.invoice_number] === 'approving' ? (
                                  <span>
                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                    Approving...
                                  </span>
                                ) : (
                                  <>
                                    <i className="bi bi-check-lg me-1"></i>
                                    Approve
                                  </>
                                )}
                              </button>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleReject(payment.invoice_number)}
                                disabled={actionLoading[payment.invoice_number]}
                              >
                                {actionLoading[payment.invoice_number] === 'rejecting' ? (
                                  <span>
                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                    Rejecting...
                                  </span>
                                ) : (
                                  <>
                                    <i className="bi bi-x-lg me-1"></i>
                                    Reject
                                  </>
                                )}
                              </button>
                              <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => openWhatsApp('6281296953557', payment.invoice_number)}
                              >
                                <i className="bi bi-whatsapp me-1"></i>
                                WA User
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
