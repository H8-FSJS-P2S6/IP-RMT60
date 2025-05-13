import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import {
  resetFilters,
  setCategoryFilter,
  setSearchFilter,
} from "../../features/products/productSlice";
import { useState } from "react";

export default function Navbar({ categories }) {
  const access_token = localStorage.getItem("access_token");
  const auth = JSON.parse(localStorage.getItem("auth"));
  console.log(auth, "<<< auth");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const handleCategoryClick = (categoryId) => {
    dispatch(setCategoryFilter(categoryId));
  };

  const handleSearch = () => {
    dispatch(setSearchFilter(search));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to={"/"}>
          Palugada
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                Categories
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item"
                    to={"/"}
                    onClick={() => dispatch(resetFilters())}
                  >
                    All
                  </Link>
                </li>
                {categories.map((el) => (
                  <li key={el.id}>
                    <Link
                      className="dropdown-item"
                      to={"/"}
                      onClick={() => handleCategoryClick(el.id)}
                    >
                      {el.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {access_token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={"/chat"}>
                    Chat With AI
                  </Link>
                </li>
                {auth &&
                  auth.roles?.some((role) =>
                    ["seller", "admin"].includes(role)
                  ) && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to={"/admin/products"}>
                          Management Product
                        </Link>
                      </li>
                    </>
                  )}
                <li className="nav-item">
                  <Link className="nav-link" to={"/shipping"}>
                    Shipping
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex me-3">
            <input
              className="form-control me-2"
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-outline-secondary"
              onClick={() => handleSearch()}
            >
              Search
            </button>
          </div>
          <div className="dropdown">
            <button className="btn btn-outline-dark" data-bs-toggle="dropdown">
              <i className="bi bi-person"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              {access_token ? (
                <>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        localStorage.removeItem("access_token");
                        navigate("/login");
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link className="dropdown-item" to={"/login"}>
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={"/register"}>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
