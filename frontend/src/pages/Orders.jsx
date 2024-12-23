import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext"; // Assuming you have a context for authentication

const API_URL = "http://localhost:5000"; // Update this with the correct API URL

const Orders = () => {
  const { token } = useContext(AuthContext); // Get the token from context
  const [orders, setOrders] = useState([]); // To store the list of order IDs
  const [orderDetails, setOrderDetails] = useState({}); // To store details of each order
  const [loading, setLoading] = useState(true); // To show loading state

  useEffect(() => {
    // Fetch orders from /orders/ endpoint
    axios
      .get(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the authorization token
        },
      })
      .then((response) => {
        const orderIds = response.data.orders;
        setOrders(orderIds);

        // Fetch order details for each order ID
        const fetchOrderDetails = orderIds.map((orderId) =>
          axios
            .get(`${API_URL}/orders/${orderId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((orderData) => {
              setOrderDetails((prevDetails) => ({
                ...prevDetails,
                [orderId]: orderData.data.orders,
              }));

              // Fetch product details for each product in the order
              orderData.data.orders.forEach((order) => {
                axios
                  .get(`${API_URL}/products/${order.product}`)
                  .then((productData) => {
                    setOrderDetails((prevDetails) => ({
                      ...prevDetails,
                      [orderId]: prevDetails[orderId].map((item) =>
                        item.product === order.product
                          ? {
                              ...item,
                              productDetails: productData.data.product,
                            }
                          : item
                      ),
                    }));
                  })
                  .catch((error) =>
                    console.error("Error fetching product details:", error)
                  );
              });
            })
            .catch((error) =>
              console.error("Error fetching order details:", error)
            )
        );

        // Wait for all requests to finish
        Promise.all(fetchOrderDetails)
          .then(() => setLoading(false))
          .catch((error) => console.error("Error fetching orders:", error));
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Orders Page
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : orders.length > 0 ? (
        <ul className="mt-4">
          {orders.map((orderId) => (
            <li key={orderId} className="p-4 mb-4 bg-white rounded shadow">
              {/* Order ID Display */}
              <h3 className="text-lg font-semibold">Order #{orderId}</h3>

              {orderDetails[orderId] ? (
                <div>
                  {/* Displaying the products */}
                  <div className="space-y-4">
                    {orderDetails[orderId].map((order) => {
                      const { productDetails, quantity, totalPrice } = order;
                      if (!productDetails) return null; // Skip if productDetails is missing
                      const { image, name, price } = productDetails;

                      return (
                        <div
                          key={order._id}
                          className="flex items-start space-x-4"
                        >
                          {/* Product Image */}
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              className="object-cover w-20 h-20 rounded-md"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-300 rounded-md"></div> // Placeholder for missing image
                          )}
                          <div className="flex flex-col w-full">
                            {/* Product Name */}
                            <div className="font-semibold">
                              {name || "Unknown Product"}
                            </div>
                            {/* Price of the product */}
                            <div className="text-sm text-gray-600">
                              Price: ${price ? price.toFixed(2) : "N/A"}
                            </div>
                            {/* Quantity */}
                            <div className="text-sm text-gray-600">
                              Quantity: {quantity}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Displaying the total order price and date at the bottom */}
                  <div className="flex items-center justify-between mt-4">
                    {/* Total price */}
                    <div className="text-lg font-semibold">
                      Total Price: $
                      {orderDetails[orderId]
                        .reduce(
                          (total, order) =>
                            total +
                            (order.totalPrice || 0) * (order.quantity || 1),
                          0
                        )
                        .toFixed(2)}
                    </div>
                    {/* Date */}
                    <div className="text-sm text-gray-600">
                      Date:{" "}
                      {new Date(
                        orderDetails[orderId][0]?.date
                      ).toLocaleDateString() || "N/A"}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Loading order details...</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-center text-gray-600">No orders available.</p>
      )}
    </div>
  );
};

export default Orders;
