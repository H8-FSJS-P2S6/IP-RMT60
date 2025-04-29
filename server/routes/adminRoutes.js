const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
const LectureController = require("../controllers/lectureController");
const authentication = require("../middlewares/authentication");
const { adminAuthorization } = require("../middlewares/authorization");

// Add authentication and admin authorization to all admin routes
router.use(authentication);
router.use(adminAuthorization);

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

module.exports = router;