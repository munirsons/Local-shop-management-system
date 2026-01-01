import React, { useEffect, useState, useCallback, useContext } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SidebarToggle from "../components/SidebarToggle";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateItem = async () => {
    try {
      await api.put(`/products/update/${editProduct.item_id}`, editProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Updated Successfully!");
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      alert("Update Failed!");
      console.log("Update Error:", err.response?.data);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Deleted Successfully!");
      fetchProducts();
    } catch (err) {
      alert("Delete Failed!");
      console.log("Delete Error:", err.response?.data);
    }
  };

  return (
    <>
      <Navbar
        user={user}
        onLogout={() => {
          logout();
          navigate("/");
        }}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <SidebarToggle onClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="container mt-4 text-light">
        <h2 className="fw-bold mb-4">Manage Products</h2>

        <table className="table table-bordered table-dark text-center">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Images</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.item_id}</td>
                <td>{p.name}</td>
                <td>{p.size_type}</td>
                <td>{p.quantity}</td>
                <td>{p.price} PKR</td>
                <td>
                  {p.images.length > 0 && (
                    <img
                      src={p.images[0]}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }} alt= " Product img not found"
                      onClick={() => setViewProduct(p)}
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm mx-1"
                    onClick={() => setEditProduct({ ...p })}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-info btn-sm mx-1"
                    onClick={() => setViewProduct(p)}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteItem(p.item_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* EDIT MODAL */}
        {editProduct && (
          <div className="modal-mask">
            <div className="modal-box bg-dark p-3 shadow-lg">
              <h5 className="fw-bold mb-3">Edit Product</h5>

              <input
                className="form-control mb-2"
                type="text"
                value={editProduct.name}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
              />

              <input
                className="form-control mb-2"
                type="number"
                value={editProduct.quantity}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, quantity: +e.target.value })
                }
              />

              <input
                className="form-control mb-2"
                type="number"
                value={editProduct.price}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, price: +e.target.value })
                }
              />

              <div className="d-flex gap-2 mt-3">
                <button className="btn btn-success w-50" onClick={updateItem}>
                  Save
                </button>
                <button
                  className="btn btn-secondary w-50"
                  onClick={() => setEditProduct(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODAL with Carousel */}
        {viewProduct && (
          <div className="modal-mask">
            <div className="modal-box bg-dark p-3 shadow-lg">
              <h5 className="fw-bold">{viewProduct.name}</h5>

              {viewProduct.images.length > 0 ? (
                <div id="carouselImages" className="carousel slide mb-3">
                  <div className="carousel-inner">
                    {viewProduct.images.map((img, i) => (
                      <div
                        key={i}
                        className={`carousel-item ${i === 0 ? "active" : ""}`}
                      >
                        <img
                          src={img}
                          className="d-block mx-auto"
                          alt= " Product img not found"
                          style={{
                            width: "250px",
                            height: "250px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselImages"
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon"></span>
                  </button>

                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselImages"
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon"></span>
                  </button>
                </div>
              ) : (
                <p>No Images</p>
              )}

              <button
                className="btn btn-secondary w-100"
                onClick={() => setViewProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
