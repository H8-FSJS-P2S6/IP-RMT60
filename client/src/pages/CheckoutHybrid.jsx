import { useEffect, useState } from 'react';
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
  // createPayment, // Commented for future use
  createManualPayment,
  selectTransactionLoading,
  selectTransactionError,
  selectPaymentRedirect,
  resetPaymentStatus,
} from '../store/slices/transactionSlice';
// import { initializeMidtransPayment, waitForMidtrans } from '../utils/midtrans'; // Commented for future use

const formatToIDR = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

export default function CheckoutHybrid() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const [midtransReady, setMidtransReady] = useState(false); // Commented for future use
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('manual');
  const [showManualInstructions, setShowManualInstructions] = useState(false);
  const [manualPaymentData, setManualPaymentData] = useState(null);
  
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

  // COMMENTED FOR FUTURE USE - MIDTRANS INTEGRATION
  /*
  useEffect(() => {
    // Check if Midtrans is available (for future use)
    const checkMidtrans = async () => {
      try {
        await waitForMidtrans();
        setMidtransReady(true);
      } catch (error) {
        console.error('Midtrans not available:', error);
        setMidtransReady(false);
      }
    };
    checkMidtrans();
  }, []);
  */

  useEffect(() => {
    if (paymentRedirect) {
      window.location.href = paymentRedirect;
      dispatch(resetPaymentStatus());
    }
  }, [paymentRedirect, dispatch]);

  const handleManualPayment = async () => {
    try {
      const response = await dispatch(createManualPayment()).unwrap();
      setManualPaymentData(response);
      setShowManualInstructions(true);
    } catch (error) {
      console.error('Manual payment error:', error);
    }
  };

  const handleGatewayPayment = async () => {
    // This will be enabled later
    alert('Payment Gateway sedang dalam tahap pengembangan. Silakan gunakan Transfer Manual untuk sementara.');
    return;
    
    /* COMMENTED FOR FUTURE USE
    try {
      const response = await dispatch(createPayment()).unwrap();
      if (response.payment.token) {
        await initializeMidtransPayment(response.payment.token, {
          onSuccess: () =>
            navigate(`/payment/success?order_id=${response.transaction.invoice_number}`),
          onPending: () =>
            navigate(`/payment/pending?order_id=${response.transaction.invoice_number}`),
          onError: (error) => {
            console.error('Payment error:', error);
            navigate(`/payment/failed?order_id=${response.transaction.invoice_number}`);
          },
          onClose: () => {
            alert('You closed the payment window. Please complete your payment to access the courses.');
          },
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
    */
  };

  const handlePayment = () => {
    if (selectedPaymentMethod === 'manual') {
      handleManualPayment();
    } else {
      handleGatewayPayment();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Nomor rekening berhasil disalin!');
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

  if (showManualInstructions && manualPaymentData) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  Pesanan Berhasil Dibuat!
                </h5>
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  <h6>Invoice: <strong>{manualPaymentData.transaction.invoice_number}</strong></h6>
                  <p className="mb-0">Total Pembayaran: <strong>{formatToIDR(manualPaymentData.transaction.total_amount)}</strong></p>
                </div>

                <h6>Informasi Pembayaran:</h6>
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <strong>Bank:</strong> {manualPaymentData.payment.bank_details.bank_name}<br/>
                        <strong>No. Rekening:</strong> 
                        <span className="ms-2">
                          {manualPaymentData.payment.bank_details.account_number}
                          <button 
                            className="btn btn-sm btn-outline-primary ms-2"
                            onClick={() => copyToClipboard(manualPaymentData.payment.bank_details.account_number)}
                          >
                            Copy
                          </button>
                        </span><br/>
                        <strong>Atas Nama:</strong> {manualPaymentData.payment.bank_details.account_name}
                      </div>
                      <div className="col-md-6">
                        <div className="text-danger">
                          <strong>⏰ Batas Pembayaran: 24 jam</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h6>Langkah Pembayaran:</h6>
                <ol>
                  {manualPaymentData.payment.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <a 
                    href={manualPaymentData.payment.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-success btn-lg"
                  >
                    <i className="bi bi-whatsapp me-2"></i>
                    Lanjut ke WhatsApp
                  </a>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/user/orders')}
                  >
                    Lihat Pesanan Saya
                  </button>
                </div>
              </div>
            </div>
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
              <h5 className="mb-0">Ringkasan Pesanan</h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th scope="col">Course</th>
                    <th scope="col" className="text-end">Harga</th>
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
                  <tr key="total-row">
                    <th>Total</th>
                    <th className="text-end">{formatToIDR(totalAmount)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Payment Method Selection */}
          <div className="card mb-3">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Pilih Metode Pembayaran</h5>
            </div>
            <div className="card-body">
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="manualPayment"
                  value="manual"
                  checked={selectedPaymentMethod === 'manual'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <label className="form-check-label" htmlFor="manualPayment">
                  <div>
                    <strong>Transfer Manual</strong>
                    <div className="text-success small">
                      <i className="bi bi-check-circle me-1"></i>
                      Tersedia Sekarang
                    </div>
                    <small className="text-muted">
                      Transfer bank + konfirmasi via WhatsApp
                    </small>
                  </div>
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="gatewayPayment"
                  value="gateway"
                  checked={selectedPaymentMethod === 'gateway'}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                <label className="form-check-label" htmlFor="gatewayPayment">
                  <div>
                    <strong>Payment Gateway</strong>
                    <div className="text-warning small">
                      <i className="bi bi-clock me-1"></i>
                      Coming Soon
                    </div>
                    <small className="text-muted">
                      Kartu kredit, e-wallet, bank transfer otomatis
                    </small>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Checkout</h5>
            </div>
            <div className="card-body">
              {selectedPaymentMethod === 'manual' ? (
                <div>
                  <div className="alert alert-info small">
                    <i className="bi bi-info-circle me-2"></i>
                    Transfer manual membutuhkan konfirmasi dalam 1x24 jam
                  </div>
                  <div className="d-grid">
                    <button
                      className="btn btn-success btn-lg"
                      onClick={handlePayment}
                      disabled={transactionLoading}
                    >
                      {transactionLoading ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Memproses...
                        </span>
                      ) : (
                        <span>
                          <i className="bi bi-whatsapp me-2"></i>
                          Lanjut ke WhatsApp
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="alert alert-warning small">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Fitur Payment Gateway sedang dalam pengembangan
                  </div>
                  <div className="d-grid">
                    <button
                      className="btn btn-outline-secondary btn-lg"
                      onClick={handlePayment}
                      disabled={true}
                    >
                      <i className="bi bi-lock me-2"></i>
                      Segera Hadir
                    </button>
                  </div>
                </div>
              )}

              {(cartError || transactionError) && (
                <div className="alert alert-danger mt-3 small">
                  {cartError || transactionError}
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          {selectedPaymentMethod === 'manual' && (
            <div className="card mt-3">
              <div className="card-body">
                <h6>Bank Transfer</h6>
                <div className="small">
                  <div className="mb-2">
                    <i className="bi bi-bank me-2 text-primary"></i>
                    Bank BCA
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-clock me-2 text-warning"></i>
                    Verifikasi 1x24 jam
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-whatsapp me-2 text-success"></i>
                    Konfirmasi via WhatsApp
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedPaymentMethod === 'gateway' && (
            <div className="card mt-3">
              <div className="card-body">
                <h6>Payment Gateway (Coming Soon)</h6>
                <div className="d-flex flex-wrap gap-2 mt-2 opacity-50">
                  <img src="https://midtrans.com/assets/images/logo-bca.svg" alt="BCA" height="24" />
                  <img src="https://midtrans.com/assets/images/logo-mandiri.svg" alt="Mandiri" height="24" />
                  <img src="https://midtrans.com/assets/images/logo-bni.svg" alt="BNI" height="24" />
                  <img src="https://midtrans.com/assets/images/logo-bri.svg" alt="BRI" height="24" />
                  <img src="https://midtrans.com/assets/images/logo-gopay.svg" alt="GoPay" height="24" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
