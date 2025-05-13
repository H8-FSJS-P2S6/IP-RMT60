import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav
      style={{
        height: "10vh",
        backgroundColor: "#d1d1d1",
        margin: "10px auto",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Link
        style={{
          textDecoration: "none",
          fontSize: "1.3rem",
          padding: 10,
          fontWeight: "bold",
          color: "#454545",
        }}
        to="/"
      >
        Home
      </Link>
    </nav>
  );
}
