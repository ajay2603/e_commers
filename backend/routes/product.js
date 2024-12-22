const router = require("express").Router();
const authSellerToken = require("../controller/authSellerToken");
const addProduct = require("../controller/addProduct");
const getProducts = require("../controller/getProducts");

router.post("/add", authSellerToken, addProduct);
router.get("/", getProducts);
module.exports = router;
