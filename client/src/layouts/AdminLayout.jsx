import { Outlet } from "react-router";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <main className="admin-main flex-grow-1 min-vh-100 p-4">
        <Outlet />
      </main>
    </div>
  );
}