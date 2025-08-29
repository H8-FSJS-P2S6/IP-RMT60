const express = require("express");
const router = express.Router();
const LectureController = require("../controllers/lectureController");
const authentication = require("../middlewares/authentication");
const { adminAuthorization } = require("../middlewares/authorization");
const { checkCourseAccess } = require("../middlewares/courseAccess");

// Public routes
router.get("/", LectureController.getAllLectures);

// User protected routes (course access for paid users) - put specific routes first
router.get("/my-courses", authentication, LectureController.getUserCourses);
router.get("/content/:id", authentication, checkCourseAccess, LectureController.getCourseContent);

// Public route with parameter (put after specific routes)
router.get("/:id", LectureController.getLectureById);

// Test route for creating sample transaction (development only)
router.post("/test/create-sample-transaction", authentication, async (req, res) => {
  try {
    const { Transaction, TransactionDetail } = require("../models");
    
    // Create a sample completed transaction for testing
    const transaction = await Transaction.create({
      UserId: req.user.id,
      total_amount: 100000,
      status: 'Completed',
      payment_method: 'Manual_Transfer',
      invoice_number: `INV-TEST-${Date.now()}`
    });

    // Add a lecture to the transaction
    await TransactionDetail.create({
      TransactionId: transaction.id,
      LectureId: 1, // Assuming lecture with ID 1 exists
      price: 100000
    });

    res.json({
      message: "Sample transaction created for testing",
      transaction
    });
  } catch (error) {
    console.error('Error creating sample transaction:', error);
    res.status(500).json({ message: error.message });
  }
});

// Protected routes (Admin only)
router.use(authentication);
router.use(adminAuthorization);
router.post("/", LectureController.createLecture);
router.put("/:id", LectureController.updateLecture);
router.delete("/:id", LectureController.deleteLecture);

module.exports = router;