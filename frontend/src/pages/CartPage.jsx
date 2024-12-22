import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext"; // Assuming you have a context for authentication

const API_BASE_URL = "http://localhost:5000"; // Update this with your API base URL

const CartPage = () => {
  const { token } = useContext(AuthContext); // Get the token from context
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setError("Please login to view your cart.");
        setLoading(false);
        return;
      }

      try {
        // Fetch cart data from the server
        const response = await axios.get(`${API_BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Extract the cart products
        const cartData = response.data.products;

        // Fetch product details for each product ID in the cart
        const productDetailsPromises = cartData.map(async (item) => {
          const productResponse = await axios.get(
            `${API_BASE_URL}/products/${item.product}`
          );
          return {
            ...item, // Spread the cart item
            productDetails: productResponse.data.product, // Add the product details to the cart item
          };
        });

        // Wait for all product details to be fetched
        const cartWithProductDetails = await Promise.all(
          productDetailsPromises
        );

        // Update the cart state with the product details
        setCart(cartWithProductDetails);
        setLoading(false);
      } catch (err) {
        setError("Failed to load cart");
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]); // Re-fetch if token changes

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/cart/remove`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { productId },
      });

      // Remove the item from the cart state
      setCart((prevCart) =>
        prevCart.filter((item) => item.product !== productId)
      );
    } catch (err) {
      setError("Failed to remove item from cart");
    }
  };

  const handleEditQuantity = async (productId, quantity) => {
    try {
      // Update the quantity for the product
      await axios.put(
        `${API_BASE_URL}/cart/edit`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the cart state with the new quantity
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product === productId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      setError("Failed to update quantity");
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/cart/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear the cart state
      setCart([]);
    } catch (err) {
      setError("Failed to clear cart");
    }
  };

  const getTotalCartPrice = () => {
    if (!cart) return 0;
    return cart.reduce((total, item) => {
      const itemTotal = item.productDetails.price * item.quantity;
      return total + itemTotal;
    }, 0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (!cart || cart.length === 0) {
    return <div>Your cart is empty</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-semibold">Your Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => {
          const totalPrice = item.productDetails.price * item.quantity; // Calculate total price for the product
          return (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg shadow-sm"
            >
              <div className="flex items-center w-full space-x-4">
                {/* Left Section: Product Image, Name & Price */}
                <div className="flex items-center w-1/2 space-x-4">
                  {/* Product Image */}
                  <img
                    src={item.productDetails.image} // Assuming `image` field is present in product details
                    alt={item.productDetails.name}
                    className="object-cover w-20 h-20 rounded-md"
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold">
                      {item.productDetails.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Price: ${item.productDetails.price.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Right Section: Quantity & Total Price */}
                <div className="flex flex-col items-end w-1/2">
                  <div className="flex items-center space-x-2">
                    {/* Edit Quantity */}
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleEditQuantity(
                          item.product,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-16 text-center border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Price: ${totalPrice.toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.product)}
                    className="mt-2 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Price */}
      <div className="flex justify-between mt-4 font-semibold">
        <div>Total Price: ${getTotalCartPrice().toFixed(2)}</div>
      </div>

      {/* Clear Cart Button */}
      <div className="mt-4">
        <button
          onClick={handleClearCart}
          className="px-4 py-2 text-white bg-red-500 rounded-md"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default CartPage;
