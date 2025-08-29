const express = require("express");
const router = express.Router();
const PublicController = require("../controllers/publicController");

// Public routes for categories
router.get("/categories", PublicController.getCategories);
router.get("/categories/:id", PublicController.getCategoryById);

// Public routes for lectures
router.get("/lectures", PublicController.getLectures);
router.get("/lectures/:id", PublicController.getLectureById);

// Homepage bundle
router.get("/homepage-bundle", PublicController.getHomepageBundle);

module.exports = router;