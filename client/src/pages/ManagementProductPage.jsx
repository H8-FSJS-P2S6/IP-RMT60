import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { LoadingSpinner } from "../components/base/Loading";

const ProductManagement = () => {
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const initialForm = {
    name: "",
    price: "",
    id: null,
    description: "",
    stock: 0,
  };

  const [form, setForm] = useState(initialForm);

  const [isEditing, setIsEditing] = useState(false);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(serverUrl + "/seller/products", {
        headers: { Authorization: "Bearer " + access_token },
      });
      setProducts(response.data.data);
    } catch (err) {
      Swal.fire({
        title: err.response?.data?.message || err.message,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      // update product
      try {
        setIsLoading(true);
        await axios.put(
          serverUrl + "/seller/products/" + form.id,
          {
            name: form.name,
            description: form.description,
            price: form.price,
            stock: form.stock,
          },
          {
            headers: {
              Authorization: "Bearer " + access_token,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setIsLoading(false);
        Swal.fire({
          title: "Product updated successfully",
          icon: "success",
          draggable: true,
        });
        fetchProduct();
      } catch (err) {
        setIsLoading(false);
        Swal.fire({
          title: err.response?.data?.message || err.message,
          icon: "error",
          draggable: true,
        });
        console.log("Failed to update product", err);
      }
      setIsEditing(false);
    } else {
      // create product
      try {
        setIsLoading(true);
        await axios.post(serverUrl + "/seller/products", form, {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
        setIsLoading(false);
        Swal.fire({
          title: "Product created successfully",
          icon: "success",
          draggable: true,
        });
        fetchProduct();
      } catch (err) {
        setIsLoading(false);
        Swal.fire({
          title: err.response?.data?.message || err.message,
          icon: "error",
          draggable: true,
        });
        console.log("Failed to create product", err);
      }
    }
    setForm({ name: "", price: "", id: null, description: "", stock: 0 });
    hideModal();
  };

  const handleAdd = () => {
    setForm(initialForm);
    setIsEditing(false);
    showModal();
  };

  const handleEdit = (product) => {
    setForm(product);
    setIsEditing(true);
    showModal();
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(serverUrl + "/seller/products/" + id, {
        headers: {
          Authorization: "Bearer " + access_token,
        },
      });
      Swal.fire({
        title: "Product deleted successfully",
        icon: "success",
        draggable: true,
      });
      fetchProduct();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        title: err.response?.data?.message || err.message,
        icon: "error",
        draggable: true,
      });
      console.log("Failed to get data", err);
    }
  };

  const showModal = () => {
    const modal = new bootstrap.Modal(document.getElementById("productModal"));
    modal.show();
  };

  const hideModal = () => {
    const modalEl = document.getElementById("productModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  };

  useEffect(() => {
    if (!access_token) {
      return navigate("/");
    }
    fetchProduct();
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner loading={isLoading} />}
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Product Management</h3>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Add Product
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={product.id}>
                  <td>{idx + 1}</td>
                  <td>{product.name}</td>
                  <td className="text-truncate" style={{ maxWidth: "150px" }}>
                    {product.description}
                  </td>
                  <td>Rp{product.price.toLocaleString()}</td>
                  <td>{product.stock}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Belum ada produk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah/Edit */}
      <div
        className="modal fade"
        id="productModal"
        tabIndex="-1"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog position-absolute top-0 end-0 mt-4 me-4">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="productModalLabel">
                  {isEditing ? "Edit Product" : "Add Product"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={hideModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    required
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={hideModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductManagement;
