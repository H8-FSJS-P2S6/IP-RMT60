import "./App.css";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import DetailProductPage from "./pages/DetailProductPage";
import HomePage from "./pages/HomePage";
import Layout from "./components/layouts/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatWithAI from "./pages/ChatAIPage";
import ProductManagement from "./pages/ManagementProductPage";
import ShippingAddress from "./pages/ShippingAddress";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:id" element={<DetailProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/chat" element={<ChatWithAI />} />
            <Route path="/shipping" element={<ShippingAddress />} />
            <Route path="/admin/products" element={<ProductManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
