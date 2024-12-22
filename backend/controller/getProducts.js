const Product = require("../models/product");
const getProducts = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { category, minPrice, maxPrice, page = 1, limit } = req.query;

    // Build filter object based on query parameters
    const filter = {};

    // Handle the category filter (if provided)
    if (category) {
      if (category !== "") {
        filter.category = category; // Only apply category filter if it's not an empty string
      }
    }

    // Handle the price range filter (minPrice and maxPrice)
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        const min = Number(minPrice);
        if (!isNaN(min)) filter.price.$gte = min; // Greater than or equal to minPrice
      }
      if (maxPrice) {
        const max = Number(maxPrice);
        if (!isNaN(max)) filter.price.$lte = max; // Less than or equal to maxPrice
      }
    }

    // Pagination: Ensure page is a number and provide default value if not supplied
    const pageNumber = Math.max(1, Number(page) || 1); // Ensure page is at least 1

    // Pagination limit (only if provided)
    const pageLimit = limit ? Math.max(1, Number(limit)) : null; // Use the provided limit or null if not given

    // Fetch products with filters and pagination (if limit is provided)
    const productsQuery = Product.find(filter).skip(
      (pageNumber - 1) * (pageLimit || 0)
    ); // Apply skip for pagination

    if (pageLimit) {
      productsQuery.limit(pageLimit); // Apply limit if provided
    }

    // Fetch products and the total number of matching products
    const products = await productsQuery;
    const totalProducts = await Product.countDocuments(filter);

    // Send paginated response
    res.status(200).json({
      products,
      totalProducts,
      totalPages: pageLimit ? Math.ceil(totalProducts / pageLimit) : 1, // Total pages if limit is provided
      currentPage: pageNumber,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = getProducts;
