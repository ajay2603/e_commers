const router = require("express").Router();
const authController = require("../controller/auth");
const authSellerToken = require("../controller/authSellerToken");
const addProduct = require("../controller/addProduct");

router.post("/add", authSellerToken, addProduct);

module.exports = router;
