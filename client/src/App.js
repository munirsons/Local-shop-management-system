import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageProducts from "./pages/ManageProducts";
import AddProduct from "./pages/AddProduct";
import Sell from "./pages/SellItems.jsx";
import BillHistory from "./pages/BillHistory";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoute from "./utils/ProtectedRoute";
import NotificationsPage from "./pages/NotificationsPage";
import UsersPage from "./pages/addUsers";
import "./styles/layout.css";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/manage-products" element={<ManageProducts />} />
        <Route path="/add-product" element={<ProtectedRoute roles={['CEO', 'Manager']}><AddProduct /></ProtectedRoute>} />
        <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><BillHistory /></ProtectedRoute>} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
