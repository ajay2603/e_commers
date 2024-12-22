import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        setErrorMessage("Please login to see products.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.products);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Failed to fetch products. Please try again.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
        Products List
      </h2>
      <div>
        {loading ? (
          <p className="text-center text-gray-600">Loading products...</p>
        ) : errorMessage ? (
          <p className="text-center text-red-600">{errorMessage}</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="p-4 space-y-4 bg-white border border-gray-300 rounded-md shadow-md"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-40 rounded-md"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {product.category}
                  </p>
                  <p className="mt-2 text-sm text-gray-800">
                    Price: ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No products added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
