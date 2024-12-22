import React, { useEffect, useState } from "react";
import axios from "axios";

const ConsumerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token"); // Token for authenticated API calls

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/products"); // Fetch products from your API
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Failed to fetch products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Function to handle adding a product to the cart
  const handleAddToCart = async (productId) => {
    try {
      setSuccessMessage(""); // Clear previous messages
      setErrorMessage("");

      if (!token) {
        setErrorMessage("You must be logged in to add items to your cart.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/cart/add",
        { productId, quantity: 1 }, // Change quantity as needed
        {
          headers: { Authorization: `Bearer ${token}` }, // Attach token for authentication
        }
      );

      alert("Product added to cart successfully!");
      setSuccessMessage("Product added to cart successfully!");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to add product to cart."
      );
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Products
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <p className="text-center text-gray-600">Loading products...</p>
        ) : errorMessage ? (
          <p className="text-center text-red-600">{errorMessage}</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="p-4 bg-white border border-gray-300 rounded-lg shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-48 rounded-md"
              />
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="mt-2 text-sm text-gray-800">
                  Price: ${product.price}
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleAddToCart(product._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500"
                >
                  Add to Cart
                </button>
                <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-gray-100 rounded-md hover:bg-gray-200">
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No products available.</p>
        )}
      </div>
      {successMessage && (
        <p className="mt-4 text-sm text-center text-green-600">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mt-4 text-sm text-center text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};

export default ConsumerDashboard;
