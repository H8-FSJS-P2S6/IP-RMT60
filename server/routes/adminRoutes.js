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
router.get("/dashboard", AdminController.getDashboard); // Endpoint gabungan untuk dashboard
router.get("/statistics", AdminController.getStatistics);
router.get("/recent-users", AdminController.getRecentUsers); // Ubah nama route untuk menghindari konflik
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
router.get("/payments/export", AdminController.exportPayments);
router.get("/payments/:id", AdminController.getPaymentById);
router.put("/payments/:id", AdminController.updatePayment);

module.exports = router;