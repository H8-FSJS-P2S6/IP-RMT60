const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController");
const authentication = require("../middlewares/authentication");

// All cart routes require authentication
router.use(authentication);
router.get("/", CartController.getUserCart);
router.post("/add", CartController.addToCart);
router.delete("/:id", CartController.removeFromCart);

module.exports = router;