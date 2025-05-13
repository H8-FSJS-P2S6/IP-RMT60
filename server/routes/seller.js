const express = require("express");
const SellerController = require("../controllers/SellerController");

const router = express.Router();

router.get("/products", SellerController.getProducts);
router.get("/products/:id", SellerController.getProductById);
router.post("/products", SellerController.createProduct);
router.put("/products/:id", SellerController.updateProductById);
router.delete("/products/:id", SellerController.deleteProductById);

module.exports = router;
