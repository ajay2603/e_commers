import React from "react";
import { Link } from "react-router-dom";

const SellerNavbar = () => {
  return (
    <nav className="p-4 bg-blue-500">
      <div className="container flex items-center justify-between mx-auto">
        <h1 className="text-xl font-bold text-white">Seller Dashboard</h1>
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/seller/"
              className="text-white transition duration-300 hover:text-gray-300"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/seller/add-product"
              className="text-white transition duration-300 hover:text-gray-300"
            >
              Add Products
            </Link>
          </li>
          <li>
            <Link
              to="/seller/orders"
              className="text-white transition duration-300 hover:text-gray-300"
            >
              Orders
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SellerNavbar;
