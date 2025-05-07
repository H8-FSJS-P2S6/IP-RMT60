import { useState } from "react";
import { Link } from "react-router";

export default function Card({
  title,
  imageUrl,
  isFeatured,
  badgeText,
  onClick,
  price,
}) {
  const [imageError, setImageError] = useState(false);

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Format price as Indonesian Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="card game-card">
      {isFeatured && <span className="featured-badge">{badgeText}</span>}
      <div
        className="card-img-container"
        style={{
          height: "400px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={
            imageError
              ? "https://via.placeholder.com/300x200?text=No+Image"
              : imageUrl
          }
          className="card-img-top"
          alt={title}
          onError={handleImageError}
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
        />
      </div>
      <div className="game-card-body">
        <h3 className="game-title" title={title}>
          {title.length > 20 ? `${title.substring(0, 20)}...` : title}
        </h3>

        {price && (
          <p className="fw-bold text-info mb-3">{formatPrice(price)}</p>
        )}
        <button
          className="btn btn-download w-100"
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

Card.defaultProps = {
  imageUrl: "https://via.placeholder.com/300x200",
  isFeatured: false,
  badgeText: "NEW",
  onClick: () => {},
  price: null,
};
