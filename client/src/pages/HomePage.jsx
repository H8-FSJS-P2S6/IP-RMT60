import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";
import ProductCard from "../components/base/ProductCard.jsx";

export default function HomePage() {
  const products = useSelector((state) => state.products.list.data);
  const category = useSelector((state) => state.products.filter.categories);
  const search = useSelector((state) => state.products.filter.q);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      fetchProducts({
        filter: {
          categories: category,
        },
        q: search,
      })
    );
  }, [category, search]);

  return (
    <div className="container py-5">
      <div className="row">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
