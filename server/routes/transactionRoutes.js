const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/transactionController");
const authentication = require("../middlewares/authentication");
const { adminAuthorization } = require("../middlewares/authorization");

// All transaction routes require authentication
router.use(authentication);

// Routes for admin (put specific admin routes first)
router.get("/admin/all", adminAuthorization, TransactionController.getAllTransactions);
router.put("/:id/status", adminAuthorization, TransactionController.updateTransactionStatus);

// Routes for users (put user routes after admin routes)
router.get("/user", TransactionController.getUserTransactions);
router.post("/", TransactionController.createTransaction);
router.get("/:id", TransactionController.getTransactionById);

module.exports = router;