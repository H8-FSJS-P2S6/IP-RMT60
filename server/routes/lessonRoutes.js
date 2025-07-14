const express = require('express');
const LessonController = require('../controllers/lessonController');
const authentication = require('../middlewares/authentication');
const router = express.Router();

// Public routes (can view lesson list but with restrictions)
router.get('/lecture/:lectureId', LessonController.getLessonsByLecture);
router.get('/:id', LessonController.getLessonById);

// Protected routes (require authentication)
router.get('/progress/:lectureId', authentication, LessonController.getUserProgress);
router.put('/:lessonId/progress', authentication, LessonController.updateProgress);

module.exports = router;
