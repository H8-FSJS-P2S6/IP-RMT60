const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
const LectureController = require("../controllers/lectureController");
const UserController = require("../controllers/userController");
const AdminController = require("../controllers/adminController");
const authentication = require("../middlewares/authentication");
const { adminAuthorization } = require("../middlewares/authorization");

// Add authentication and admin authorization to all admin routes
router.use(authentication);
router.use(adminAuthorization);

// Dashboard APIs
router.get("/dashboard", AdminController.getDashboard); // Combined endpoint for dashboard
router.get("/statistics", AdminController.getStatistics);
router.get("/recent-users", AdminController.getRecentUsers); // Change route name to avoid conflicts
router.get("/orders", AdminController.getRecentOrders);
router.get("/categories/stats", AdminController.getCategoriesStats);
router.get("/orders/monthly", AdminController.getMonthlySales);

// Categories routes
router.get("/categories", CategoryController.getAllCategories);
router.post("/categories", CategoryController.createCategory);
router.put("/categories/:id", CategoryController.updateCategory);
router.delete("/categories/:id", CategoryController.deleteCategory);

// Lectures routes
router.get("/lectures", LectureController.getAllLectures);
router.post("/lectures", LectureController.createLecture);
router.put("/lectures/:id", LectureController.updateLecture);
router.delete("/lectures/:id", LectureController.deleteLecture);

// Users routes 
router.get("/users", UserController.getAllUsers); 
router.post("/users", UserController.createUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

// Transactions routes
router.get("/transactions/export", AdminController.exportTransactions); // Place export route before the :id route
router.get("/transactions", AdminController.getTransactions);
router.get("/transactions/:id", AdminController.getTransactionById);
router.put("/transactions/:id", AdminController.updateTransaction);

// Payments routes
router.get("/payments", AdminController.getPayments);
router.get("/payments/pending", AdminController.getPendingPayments);
router.get("/payments/stats", AdminController.getPaymentStats);
router.patch("/payments/approve/:invoice_number", AdminController.approvePayment);
router.patch("/payments/reject/:invoice_number", AdminController.rejectPayment);
router.get("/payments/export", AdminController.exportPayments);
router.get("/payments/:id", AdminController.getPaymentById);
router.put("/payments/:id", AdminController.updatePayment);

// Test route for creating sample data (development only)
router.post("/test/create-sample-transaction", async (req, res) => {
  try {
    const { Transaction, TransactionDetail, User } = require("../models");
    const { userId, lectureId } = req.body;
    
    if (!userId || !lectureId) {
      return res.status(400).json({ message: "userId and lectureId are required" });
    }
    
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Create a completed transaction for testing
    const transaction = await Transaction.create({
      UserId: userId,
      total_amount: 100000,
      status: 'Completed',
      payment_method: 'Manual_Transfer',
      invoice_number: `INV-TEST-${Date.now()}`
    });

    // Add the lecture to the transaction
    await TransactionDetail.create({
      TransactionId: transaction.id,
      LectureId: lectureId,
      price: 100000
    });

    res.json({
      message: "Sample completed transaction created for testing",
      transaction: {
        id: transaction.id,
        userId: transaction.UserId,
        status: transaction.status,
        invoice_number: transaction.invoice_number
      }
    });
  } catch (error) {
    console.error('Error creating sample transaction:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;