import { Outlet } from "react-router";
import ModernNavbar from "../components/ModernNavbar";
import ModernFooter from "../components/ModernFooter";
import Chatbot from "../components/Chatbot";

export default function ModernMainLayout() {
  return (
    <>
      <ModernNavbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <ModernFooter />
      <Chatbot />
    </>
  );
}
