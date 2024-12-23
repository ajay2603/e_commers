import { Routes, Route } from "react-router-dom";
import Navbar from "../pages/Navbar";
import ConsumerDashboard from "../pages/ConsumerDashboard";
import CartPage from "../pages/CartPage";
import OrderPage from "../pages/Orders"

const ConsumerRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ConsumerDashboard />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderPage />} />
      </Routes>
    </>
  );
};

export default ConsumerRoutes;
