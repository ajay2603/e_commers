const Product = require("../models/product"); // Adjust path to your Product model
 // Adjust path to your Product model

const addProduct = async (req, res) => {
  try {
    const { name, description, stock, price, image, category } = req.body;

    // Validation for required fields
    if (!name || !price) {
      return res
        .status(400)
        .json({ message: "Product name and price are required." });
    }

    // Category validation: Check if the category is valid
    const validCategories = [
      "electronics",
      "clothing",
      "accessories",
      "books",
      "others",
    ];
    if (category && !validCategories.includes(category)) {
      return res
        .status(400)
        .json({
          message:
            "Invalid category. Must be one of: 'electronics', 'clothing', 'accessories', 'books', or 'others'.",
        });
    }

    // Set default values for optional fields if not provided
    const newProduct = new Product({
      name,
      description: description || "", // Default to an empty string if not provided
      stock: stock || 1, // Default to 1 if not provided
      price,
      image:
        image ||
        "https://w7.pngwing.com/pngs/430/578/png-transparent-cardboard-box-corrugated-box-design-corrugated-fiberboard-box-miscellaneous-rectangle-cardboard-thumbnail.png", // Default to the provided image URL if not provided
      category: category || "others", // Default to "others" if not provided
      seller: req.user._id, // Use the authenticated seller's _id
    });

    // Save the product to the database
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product added successfully.", product: newProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = addProduct;
