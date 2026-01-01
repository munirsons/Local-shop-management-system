import React, { useState, useEffect, useCallback, useContext } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SidebarToggle from "../components/SidebarToggle";
import "./SellItems.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function SellItems() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const token = localStorage.getItem("token");

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // LOAD PRODUCTS
  const loadProducts = useCallback(async () => {
    try {
      const res = await api.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.log("Product Load Error:", err);
    }
  }, [token]);

  // LOAD CART
  const loadCart = useCallback(async () => {
    try {
      const res = await api.get("/bill/view", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.log("Cart Load Error:", err);
    }
  }, [token]);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, [loadProducts, loadCart]);

  // ADD ITEM
  const addToCart = async (p) => {
    try {
      await api.post(
        "/bill/add",
        {
          item_id: p.item_id,
          name: p.name,
          price: p.price,
          quantity: 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadCart();
    } catch (err) {
      console.log("Add Error:", err);
    }
  };

  const updateQty = async (item, amt) => {
    await api.post(
      "/bill/add",
      {
        item_id: item.item_id,
        name: item.name,
        price: item.price,
        quantity: amt,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadCart();
  };

  const removeItem = async (id) => {
    await api.post(
      "/bill/remove",
      { item_id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadCart();
  };

  // PRINT BILL
  const printBill = async () => {
    if (!custName || !custPhone || !custAddress) {
      alert("Enter complete customer info!");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      const payload = {
        customer_name: custName,
        customer_phone: custPhone,
        customer_address: custAddress,
        payment_method: paymentMethod,
        items: cart.map((i) => ({
          item_id: i.item_id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
      };

      const res = await api.post("/bill/print", payload, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      window.open(url, "_blank");

      alert("Bill Printed Successfully!");

      setShowCheckoutModal(false);
      setShowCartModal(false);

      setCustName("");
      setCustPhone("");
      setCustAddress("");
      setPaymentMethod("Cash on Delivery");

      loadCart();
    } catch (err) {
      console.log("Bill Print Error:", err);
      alert("Failed to print bill!");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.item_id.toLowerCase().includes(search.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ---------------- RETURN ------------------
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

      <br />
      <br />
      <br />

      <div className="sell-wrapper">
        <input
          className="form-control search-bar"
          placeholder="Search products by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <br />

        <div className="action-bar">
          <button className="btn btn-primary" onClick={() => setShowCartModal(true)}>
            📄 View Bill ({cart.length})
          </button>

          <button
            className="btn btn-success"
            disabled={cart.length === 0}
            onClick={() => setShowCheckoutModal(true)}
          >
            🖨 Create Bill
          </button>
        </div>

        <div className="row mt-4">
          {filtered.map((p) => (
            <div key={p._id} className="col-md-3 mb-4">
              <div className="card product-box">
                {p.images && p.images.length > 1 ? (
                  <div id={`carousel-${p._id}`} className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                      {p.images.map((img, idx) => (
                        <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                          <img
                            src={img || "https://via.placeholder.com/200"}
                            className="d-block w-100 product-image"
                            alt={`${p.name} - ${idx + 1}`}
                            style={{ height: "15em", width: "auto" }}
                          />
                        </div>
                      ))}
                    </div>

                    <a
                      className="carousel-control-prev"
                      href={`#carousel-${p._id}`}
                      role="button"
                      data-slide="prev"
                      aria-label="Previous"
                    >
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    </a>

                    <a
                      className="carousel-control-next"
                      href={`#carousel-${p._id}`}
                      role="button"
                      data-slide="next"
                      aria-label="Next"
                    >
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    </a>
                  </div>
                ) : (
                  <img
                    src={p.images?.[0] || "https://via.placeholder.com/200"}
                    className="product-image"
                    alt={p.name}
                    style={{ height: "15em", width: "auto" }}
                  />
                )}

                <h4 className="text-dark font-weight-bold">{p.name}</h4>
                <p className="price-tag">PKR {p.price.toLocaleString()}</p>
                <button className="btn btn-primary add-btn" onClick={() => addToCart(p)}>
                  🛒 Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CART POPUP */}
      {showCartModal && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-header">
              <h4 className="popup-title">🛒 Current Selection</h4>
              <button className="popup-close" onClick={() => setShowCartModal(false)}>
                ✕
              </button>
            </div>

            <div className="popup-body">
              {cart.map((item, idx) => (
                <div key={item.item_id} className="popup-cart-item">
                  <div>
                    <strong>
                      {idx + 1}. {item.name}
                    </strong>
                    <p className="item-info">ID: {item.item_id} | PKR {item.price}</p>
                  </div>

                  <div className="qty-control">
                    <button onClick={() => updateQty(item, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item, 1)}>+</button>
                  </div>

                  <button className="remove-btn" onClick={() => removeItem(item.item_id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="popup-footer">
              <h5>
                Total: <span className="total-amount">PKR {cartTotal.toLocaleString()}</span>
              </h5>

              <button
                className="checkout-btn"
                onClick={() => {
                  setShowCartModal(false);
                  setShowCheckoutModal(true);
                }}
              >
                Proceed to Checkout
              </button>

              <button className="cancel-btn" onClick={() => setShowCartModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT POPUP */}
      {showCheckoutModal && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h4 className="popup-title">Checkout Details</h4>

            <input
              className="form-control mt-2"
              value={custName}
              placeholder="Customer Name"
              onChange={(e) => setCustName(e.target.value)}
            />

            <input
              className="form-control mt-2"
              value={custPhone}
              placeholder="Phone"
              onChange={(e) => setCustPhone(e.target.value)}
            />

            <textarea
              className="form-control mt-2"
              value={custAddress}
              placeholder="Address"
              onChange={(e) => setCustAddress(e.target.value)}
            />

            <select
              className="form-control mt-2"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option>Cash on Delivery</option>
              <option>Pre-Paid</option>
            </select>

            <button className="btn btn-success mt-3" onClick={printBill}>
              🖨 Print Bill
            </button>

            <button className="btn btn-secondary mt-2" onClick={() => setShowCheckoutModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
