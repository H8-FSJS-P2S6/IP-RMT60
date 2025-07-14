const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/transactionController");
const authentication = require("../middlewares/authentication");
const { adminAuthorization } = require("../middlewares/authorization");

// All transaction routes require authentication
router.use(authentication);

// Routes for users
router.get("/user", TransactionController.getUserTransactions);
router.post("/", TransactionController.createTransaction);
router.get("/:id", TransactionController.getTransactionById);

// Routes for admin
router.get("/", adminAuthorization, TransactionController.getAllTransactions);
router.put("/:id/status", adminAuthorization, TransactionController.updateTransactionStatus);

module.exports = router;