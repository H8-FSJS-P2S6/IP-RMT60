import { Outlet } from "react-router";
import Navbar from "../base/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "../../features/categories/categorySlice";

export default function Layout() {
  const categories = useSelector((state) => state.categories.list);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);
  return (
    <>
      <Navbar categories={categories} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
