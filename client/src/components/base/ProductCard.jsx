import { Link } from "react-router";

export default function ProductCard({ product }) {
  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100 shadow-sm">
        <Link to={`/products/${product.id}`}>
          <img
            src={
              Array.isArray(product.Images)
                ? product.Images[0].image
                : "https://picsum.photos/200"
            }
            className="card-img-top"
            alt={product.name}
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <span className="badge bg-primary mb-2">
            {Array.isArray(product.Categories)
              ? product.Categories.map((el) => el.name).join(", ")
              : "General"}
          </span>
          <p className="card-text">Rp {product.price.toFixed(2)}</p>
          <button className="btn btn-sm btn-outline-dark w-100">
            <i className="bi bi-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
