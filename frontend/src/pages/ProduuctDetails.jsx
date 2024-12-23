import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetailsPage = () => {
  const { id } = useParams(); // Get product ID from the URL
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);

        // Fetch the product details by ID
        const productResponse = await axios.get(
          `http://localhost:5000/products/${id}`
        );
        setProduct(productResponse.data.product);

        // Fetch the seller's details (using the seller ID from product)
        const sellerResponse = await axios.get(
          `http://localhost:5000/sellers/${productResponse.data.product.seller}`
        );
        setSeller(sellerResponse.data); // Save seller details

        setLoading(false);
      } catch (error) {
        setErrorMessage("Product or seller not found.");
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]); // Run whenever the product ID changes

  // Function to handle adding a product to the cart
  const handleAddToCart = async (productId) => {
    try {
      setSuccessMessage(""); // Clear previous messages
      setErrorMessage(""); // Clear previous error messages

      if (!token) {
        setErrorMessage("You must be logged in to add items to your cart.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/cart/add",
        { productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Product added to cart successfully!");
      alert("Product added to cart successfully!");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to add product to cart."
      );
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-600">Loading product details...</p>
    );
  }

  if (errorMessage) {
    return <p className="text-center text-red-600">{errorMessage}</p>;
  }

  return (
    <div className="p-8 bg-gray-100">
      {/* Product Details Section */}
      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
        <div className="mt-6">
          {/* Product Information */}
          <div className="space-y-4">
            <div className="mt-4">
              <strong className="text-gray-600">Image:</strong>
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-64 mt-2 rounded-lg"
              />
            </div>

            <div>
              <strong className="text-gray-600">Name:</strong>
              <p className="text-gray-800">{product.name}</p>
            </div>

            <div>
              <strong className="text-gray-600">ID:</strong>
              <p className="text-gray-800">{product._id}</p>
            </div>

            <div>
              <strong className="text-gray-600">Category:</strong>
              <p className="text-gray-800">{product.category}</p>
            </div>

            <div>
              <strong className="text-gray-600">Price:</strong>
              <p className="text-gray-800">${product.price}</p>
            </div>

            <div>
              <strong className="text-gray-600">Description:</strong>
              <p className="text-gray-800">{product.description}</p>
            </div>

            <div>
              <strong className="text-gray-600">Stock:</strong>
              <p
                className={`text-lg font-semibold ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `In Stock: ${product.stock}`
                  : "Out of Stock"}
              </p>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => handleAddToCart(product._id)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              product.stock > 0
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-gray-400 text-gray-800 cursor-not-allowed"
            }`}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
        </div>

        {/* Seller Information Section */}
        <div className="pt-6 mt-8 border-t">
          <h3 className="text-xl font-semibold text-gray-800">
            Seller Details
          </h3>
          <div className="space-y-4">
            <div>
              <strong className="text-gray-600">Seller Name:</strong>
              <p className="text-gray-800">{seller?.name}</p>
            </div>

            <div>
              <strong className="text-gray-600">Seller ID:</strong>
              <p className="text-gray-800">{seller?._id}</p>
            </div>

            <div>
              <strong className="text-gray-600">Seller Address:</strong>
              <p className="text-gray-800">{seller?.address}</p>
            </div>
          </div>
        </div>

        {/* Display Success or Error Message */}
        {successMessage && (
          <p className="mt-4 text-sm text-center text-green-600">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="mt-4 text-sm text-center text-red-600">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
