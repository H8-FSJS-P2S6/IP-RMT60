const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");
const authentication = require("../middlewares/authentication");
const { adminAuthorization } = require("../middlewares/authorization");

// Public routes
router.get("/", CategoryController.getAllCategories);
router.get("/:id", CategoryController.getCategoryById);

// Protected routes (Admin only)
router.use(authentication);
router.use(adminAuthorization);
router.post("/", CategoryController.createCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

module.exports = router;