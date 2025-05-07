import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../store/favoriteSlice";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favorites, loading: favoriteLoading } = useSelector(
    (state) => state.favorites
  );
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isFavorite = favorites.some((fav) => fav.id === Number(id));

  useEffect(() => {
    const fetchDeviceDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        if (token) {
          setIsAuthenticated(true);
          const response = await axios.get(
            `http://localhost:3000/public/devices/${id}`,
            {
              headers: { access_token: token },
            }
          );
          setDevice(response.data);
        } else {
          const response = await axios.get(
            `http://localhost:3000/public/devices/${id}`
          );
          setDevice(response.data);
        }
        setLoading(false);
      } catch (err) {
        setError("Gagal mengambil data detail HP");
        setLoading(false);
        console.error("Error fetching device detail:", err);
      }
    };

    fetchDeviceDetail();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(toggleFavorite(id));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{device ? `${device.device_name} - Detail` : "Loading..."}</title>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary-color: #3a0ca3;
              --secondary-color: #4cc9f0;
              --accent-color: #f72585;
              --dark-bg: #121212;
              --card-bg: #1e1e1e;
            }

            body {
              background-color: var(--dark-bg);
              color: #fff;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .navbar {
              background-color: var(--primary-color);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            }

            .navbar-brand {
              font-weight: 700;
              font-size: 1.8rem;
              text-transform: uppercase;
            }

            .detail-image-container {
              background-color: var(--card-bg);
              border-radius: 15px;
              padding: 20px;
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
              margin-bottom: 20px;
            }

            .device-image {
              max-height: 400px;
              object-fit: contain;
              width: 100%;
            }

            .device-title {
              font-size: 2.5rem;
              font-weight: 700;
              margin-bottom: 10px;
              color: #fff;
            }

            .device-price {
              font-size: 1.8rem;
              font-weight: 600;
              color: var(--secondary-color);
              margin-bottom: 20px;
            }

            .spec-card {
              background-color: var(--card-bg);
              border-radius: 15px;
              padding: 20px;
              margin-bottom: 20px;
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
            }

            .spec-title {
              font-size: 1.2rem;
              font-weight: 600;
              color: var(--secondary-color);
              margin-bottom: 5px;
              border-left: 3px solid var(--accent-color);
              padding-left: 10px;
            }

            .spec-value {
              font-size: 1rem;
              margin-bottom: 15px;
              padding-left: 13px;
            }

            .btn-favorite {
              background-color: var(--accent-color);
              color: #fff;
              border: none;
              padding: 10px 20px;
              border-radius: 30px;
              font-weight: 600;
              margin-right: 10px;
              transition: all 0.3s ease;
            }

            .btn-favorite:hover {
              transform: translateY(-3px);
              box-shadow: 0 5px 15px rgba(247, 37, 133, 0.4);
            }

            .btn-favorite.active {
              background-color: #ff0060;
            }

            .btn-back {
              background-color: var(--card-bg);
              color: #fff;
              border: 1px solid rgba(255, 255, 255, 0.2);
              padding: 10px 20px;
              border-radius: 30px;
              font-weight: 600;
              transition: all 0.3s ease;
            }

            .btn-back:hover {
              background-color: rgba(255, 255, 255, 0.1);
              transform: translateY(-3px);
            }

            .loading-spinner {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 400px;
            }

            .error-message {
              background-color: var(--accent-color);
              color: white;
              padding: 15px;
              border-radius: 10px;
              margin: 20px 0;
              text-align: center;
            }
          `,
        }}
      />

      <Navbar />

      <div className="container mt-4">
        {error && (
          <div className="error-message">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {loading || favoriteLoading ? (
          <div className="loading-spinner">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          device && (
            <div className="row">
              <div className="col-md-5">
                <div className="detail-image-container">
                  <img
                    src={
                      device.device_image ||
                      "https://via.placeholder.com/300x400?text=No+Image"
                    }
                    alt={device.device_name}
                    className="device-image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x400?text=No+Image";
                    }}
                  />
                </div>
                <div className="d-flex mb-4">
                  <button
                    className="btn btn-back me-2"
                    onClick={handleBackClick}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Kembali
                  </button>
                  {isAuthenticated && (
                    <button
                      className={`btn btn-favorite ${
                        isFavorite ? "active" : ""
                      }`}
                      onClick={handleToggleFavorite}
                    >
                      <i
                        className={`bi ${
                          isFavorite ? "bi-heart-fill" : "bi-heart"
                        } me-2`}
                      ></i>
                      {isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                    </button>
                  )}
                </div>
              </div>

              <div className="col-md-7">
                <h1 className="device-title">{device.device_name}</h1>
                <p className="device-price">{formatPrice(device.price)}</p>

                <div className="row">
                  <div className="col-md-6">
                    <div className="spec-card">
                      <h3 className="mb-4 border-bottom pb-2">
                        Spesifikasi Utama
                      </h3>

                      {device.display_size && (
                        <>
                          <div className="spec-title">Layar</div>
                          <div className="spec-value">
                            {device.display_size}
                          </div>
                        </>
                      )}

                      {device.display_res && (
                        <>
                          <div className="spec-title">Resolusi Layar</div>
                          <div className="spec-value">{device.display_res}</div>
                        </>
                      )}

                      {device.camera && (
                        <>
                          <div className="spec-title">Kamera</div>
                          <div className="spec-value">{device.camera}</div>
                        </>
                      )}

                      {device.chipset && (
                        <>
                          <div className="spec-title">Chipset</div>
                          <div className="spec-value">{device.chipset}</div>
                        </>
                      )}

                      {device.ram && (
                        <>
                          <div className="spec-title">RAM</div>
                          <div className="spec-value">{device.ram}</div>
                        </>
                      )}

                      {device.storage && (
                        <>
                          <div className="spec-title">Penyimpanan</div>
                          <div className="spec-value">{device.storage}</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="spec-card">
                      <h3 className="mb-4 border-bottom pb-2">
                        Detail Tambahan
                      </h3>

                      {device.battery && (
                        <>
                          <div className="spec-title">Baterai</div>
                          <div className="spec-value">{device.battery}</div>
                        </>
                      )}

                      {device.batteryType && (
                        <>
                          <div className="spec-title">Tipe Baterai</div>
                          <div className="spec-value">{device.batteryType}</div>
                        </>
                      )}

                      {device.os_type && (
                        <>
                          <div className="spec-title">Sistem Operasi</div>
                          <div className="spec-value">{device.os_type}</div>
                        </>
                      )}

                      {device.body && (
                        <>
                          <div className="spec-title">Bahan Body</div>
                          <div className="spec-value">{device.body}</div>
                        </>
                      )}

                      {device.video && (
                        <>
                          <div className="spec-title">Rekaman Video</div>
                          <div className="spec-value">{device.video}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {device.comment && (
                  <div className="spec-card">
                    <h3 className="mb-3">Deskripsi</h3>
                    <p>{device.comment}</p>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
}
