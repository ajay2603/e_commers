import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerDashboard = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("others");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [token, setToken] = useState(""); // State to hold the token
  const [products, setProducts] = useState([]); // State to hold the list of products
  const [loading, setLoading] = useState(true); // To handle loading state for products

  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // Get the token from localStorage
    if (storedToken) {
      setToken(storedToken); // Set token in state
    } else {
      setErrorMessage("Please login first."); // Token not found
    }

    // Fetch the products from the database when the component mounts
    const fetchProducts = async () => {
      if (!token) {
        setErrorMessage("Please login to see products.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Set loading state to true before fetching
        const response = await axios.get("http://localhost:5000/products", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers for authorization
          },
        });

        setProducts(response.data.products); // Set fetched products into state
        setLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage("Failed to fetch products. Please try again.");
        setLoading(false); // Set loading state to false in case of error
      }
    };

    fetchProducts();
  }, [token]); // Fetch products only when token changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error messages
    setSuccessMessage(""); // Clear previous success messages

    // Only proceed if the token is available
    if (!token) {
      setErrorMessage("Unauthorized. Please login to add a product.");
      return;
    }

    const productData = {
      name,
      description,
      stock,
      price,
      image,
      category,
    };

    try {
      // Send the product data along with the token for authentication
      const response = await axios.post(
        "http://localhost:5000/products/add",
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use token in the request header
          },
        }
      );
      setSuccessMessage("Product added successfully!");

      // Fetch the updated list of products
      const updatedProducts = await axios.get(
        "http://localhost:5000/products",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the request header
          },
        }
      );
      setProducts(updatedProducts.data);

      // Clear form inputs after submission
      setName("");
      setDescription("");
      setStock(1);
      setPrice("");
      setImage("");
      setCategory("others");
    } catch (error) {
      console.error("Error adding product:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to add product."
      );
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Form Section - Left */}
        <div className="w-full p-8 bg-white rounded-lg shadow-md lg:w-1/2">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Add Product
          </h2>
          {errorMessage && (
            <p className="mt-4 text-sm text-center text-red-600">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="mt-4 text-sm text-center text-green-600">
              {successMessage}
            </p>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter product description"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter stock quantity"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter product price"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter image URL"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="books">Books</option>
                <option value="others">Others</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Products List - Right */}
        <div className="w-full p-8 bg-white rounded-lg shadow-md lg:w-1/2">
          <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
            Products List
          </h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-600">Loading products...</p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center p-4 space-x-4 border border-gray-300 rounded-md"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-20 h-20 rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="text-sm text-gray-800">
                      Price: ${product.price}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">
                No products added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
