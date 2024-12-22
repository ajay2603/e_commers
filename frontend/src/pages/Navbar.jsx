import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="text-white bg-blue-500 shadow-md">
      <div className="container flex items-center justify-between p-4 mx-auto">
        <h1 className="text-xl font-bold">
          <Link to="/" className="hover:text-gray-300">
            E-Commerce
          </Link>
        </h1>
        <ul className="flex space-x-6 text-sm font-medium">
          <li>
            <Link to="/" className="hover:text-gray-300">
              Products
            </Link>
          </li>
          <li>
            <Link to="/orders" className="hover:text-gray-300">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/cart" className="hover:text-gray-300">
              Cart
            </Link>
          </li>
          <li>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
