const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/transactionController");
const authentication = require("../middlewares/authentication");
const { adminAuthorization } = require("../middlewares/authorization");

// Semua route transaction memerlukan autentikasi
router.use(authentication);

// Route untuk user
router.get("/user", TransactionController.getUserTransactions);
router.post("/", TransactionController.createTransaction);
router.get("/:id", TransactionController.getTransactionById);

// Route untuk admin
router.get("/", adminAuthorization, TransactionController.getAllTransactions);
router.put("/:id/status", adminAuthorization, TransactionController.updateTransactionStatus);

module.exports = router;