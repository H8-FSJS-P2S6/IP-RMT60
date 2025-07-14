import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="min-vh-100">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}