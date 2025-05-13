import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./features/products/productSlice";
import categoryReducer from "./features/categories/categorySlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    categories: categoryReducer,
  },
});
