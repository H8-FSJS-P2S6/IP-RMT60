import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { fetchProductById } from "../features/products/productSlice";

export default function DetailMoviePage() {
  const [error, setError] = useState(null);

  const params = useParams();
  const product = useSelector((state) => state.products.detail);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchProductById(params.id));
      } catch (err) {
        setError(err);
      }
    })();
  }, [params]);

  if (!product) {
    return (
      <div>
        <h5>Fetching Product...</h5>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h5>{error.response.data.message}</h5>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 10 }}>
        <img
          src={
            Array.isArray(product.Images)
              ? product.Images[0].image
              : "https://picsum.photos/200"
          }
          alt={product.name}
          width="50%"
        />
        <div>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>
            {Array.isArray(product.Categories)
              ? product.Categories.map((el) => el.name).join(", ")
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
