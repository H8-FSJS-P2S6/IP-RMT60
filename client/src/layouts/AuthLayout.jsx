import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="auth-layout min-vh-100 d-flex align-items-center bg-light">
      <Outlet />
    </main>
  );
}