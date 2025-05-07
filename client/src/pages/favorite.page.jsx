import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavorites, clearError } from "../store/favoriteSlice";
import Navbar from "../components/Navbar";
import Card from "../components/card";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import HomeStyles from "../components/HomeStyles";

export default function FavoritePage() {
  const { favorites, loading, error } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    dispatch(fetchFavorites());
  }, [dispatch, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleCardClick = (phoneId) => {
    if (phoneId) {
      navigate(`/devices/${phoneId}`);
    }
  };

  return (
    <>
      <HomeStyles />
      <Navbar />
      <div className="container mt-5">
        <h1 className="mb-4">Daftar HP Favorit</h1>
        {error && <ErrorMessage message={error} />}
        {loading ? (
          <LoadingSpinner />
        ) : favorites.length === 0 ? (
          <div className="alert alert-info">
            Anda belum memiliki HP favorit. Kembali ke{" "}
            <a href="/">halaman utama</a> untuk menambahkan.
          </div>
        ) : (
          <div className="row">
            {favorites.map((favorite, index) => (
              <div
                className="col-md-3 col-sm-6 mb-4"
                key={favorite.id || index}
              >
                <Card
                  title={favorite.device_name || "Nama Tidak Tersedia"}
                  imageUrl={
                    favorite.device_image || "https://via.placeholder.com/150"
                  }
                  isFeatured={false}
                  price={favorite.price || 0}
                  onClick={() => handleCardClick(favorite.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
