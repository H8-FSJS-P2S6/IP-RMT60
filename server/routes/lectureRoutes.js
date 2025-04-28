const express = require("express");
const router = express.Router();
const LectureController = require("../controllers/lectureController");
const authentication = require("../middlewares/authentication");
const { adminAuthorization } = require("../middlewares/authorization");

// Public routes
router.get("/", LectureController.getAllLectures);
router.get("/:id", LectureController.getLectureById);

// Protected routes (Admin only)
router.use(authentication);
router.use(adminAuthorization);
router.post("/", LectureController.createLecture);
router.put("/:id", LectureController.updateLecture);
router.delete("/:id", LectureController.deleteLecture);

module.exports = router;