const router = require("express").Router();
const authUserToken = require("../controller/authUserToken");
const { placeOrder } = require("../controller/order");

router.post("/place", authUserToken, placeOrder);

module.exports = router;
