const Product = require("../models/product");
const Order = require("../models/order");
const { v4: uuidv4 } = require("uuid");

const placeOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const uuid = uuidv4(); // Generate unique order ID

    // Check if products are provided
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products in the order",
      });
    }

    // Create an array of promises for saving orders
    const orderPromises = products.map(async (product) => {
      const productDetails = await Product.findById(product.product);
      if (!productDetails) {
        throw new Error(`Product with ID ${product.product} not found`);
      }

      // Create an order for each product
      const order = new Order({
        orderId: uuid,
        userId: req.user._id,
        product: product.product,
        quantity: product.quantity,
        seller: productDetails.seller, // Assign seller from the product model
        totalPrice: productDetails.price * product.quantity,
      });

      // Save the order
      await order.save();
    });

    // Wait for all orders to be saved
    await Promise.all(orderPromises);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.distinct("orderId", { userId: req.user._id });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orders = await Order.find({ orderId, userId: req.user._id });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const orders = await Order.distinct("orderId", { seller: req.user._id });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const getSellerOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orders = await Order.find({ orderId, seller: req.user._id });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  placeOrder,
  getOrders,
  getOrder,
  getSellerOrders,
  getSellerOrder,
};
