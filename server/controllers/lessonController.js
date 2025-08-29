const { Lesson, Lecture, UserProgress, User, Transaction, TransactionDetail } = require('../models');
const { Op } = require('sequelize');

class LessonController {
  // Get all lessons for a lecture
  static async getLessonsByLecture(req, res, next) {
    try {
      const { lectureId } = req.params;
      const userId = req.user?.id;

      // Check if user has purchased the course
      let hasPurchased = false;
      if (userId) {
        const purchase = await TransactionDetail.findOne({
          include: [{
            model: Transaction,
            where: { 
              UserId: userId,
              status: 'success'
            }
          }],
          where: { LectureId: lectureId }
        });
        hasPurchased = !!purchase;
      }

      // Get lessons
      const lessons = await Lesson.findAll({
        where: { LectureId: lectureId },
        order: [['order', 'ASC']],
        include: [{
          model: Lecture,
          as: 'lecture',
          attributes: ['id', 'title', 'name']
        }]
      });

      // Filter lessons based on purchase status
      const filteredLessons = lessons.map(lesson => {
        const lessonData = lesson.toJSON();
        
        // If user hasn't purchased and lesson is not preview, hide video URL
        if (!hasPurchased && !lesson.isPreview) {
          lessonData.videoUrl = null;
          lessonData.isLocked = true;
        } else {
          lessonData.isLocked = false;
        }
        
        return lessonData;
      });

      res.status(200).json({
        success: true,
        data: filteredLessons,
        hasPurchased
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single lesson details
  static async getLessonById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const lesson = await Lesson.findByPk(id, {
        include: [{
          model: Lecture,
          as: 'lecture',
          attributes: ['id', 'title', 'name', 'price']
        }]
      });

      if (!lesson) {
        return res.status(404).json({
          success: false,
          message: 'Lesson not found'
        });
      }

      // Check if user has purchased the course
      let hasPurchased = false;
      if (userId) {
        const purchase = await TransactionDetail.findOne({
          include: [{
            model: Transaction,
            where: { 
              UserId: userId,
              status: 'success'
            }
          }],
          where: { LectureId: lesson.LectureId }
        });
        hasPurchased = !!purchase;
      }

      const lessonData = lesson.toJSON();

      // If user hasn't purchased and lesson is not preview, hide video URL
      if (!hasPurchased && !lesson.isPreview) {
        lessonData.videoUrl = null;
        lessonData.isLocked = true;
      } else {
        lessonData.isLocked = false;
      }

      res.status(200).json({
        success: true,
        data: lessonData,
        hasPurchased
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user progress
  static async updateProgress(req, res, next) {
    try {
      const { lessonId } = req.params;
      const { watchTime, isCompleted } = req.body;
      const userId = req.user.id;

      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) {
        return res.status(404).json({
          success: false,
          message: 'Lesson not found'
        });
      }

      // Check if user has purchased the course
      const purchase = await TransactionDetail.findOne({
        include: [{
          model: Transaction,
          where: { 
            UserId: userId,
            status: 'success'
          }
        }],
        where: { LectureId: lesson.LectureId }
      });

      if (!purchase) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Please purchase the course first.'
        });
      }

      // Find or create user progress
      let [progress] = await UserProgress.findOrCreate({
        where: {
          UserId: userId,
          LectureId: lesson.LectureId
        },
        defaults: {
          currentLessonId: lessonId,
          completedLessons: [],
          progressPercentage: 0,
          totalWatchTime: 0,
          lastWatchedAt: new Date()
        }
      });

      // Update progress
      progress.currentLessonId = lessonId;
      progress.lastWatchedAt = new Date();
      
      if (watchTime) {
        progress.totalWatchTime += watchTime;
      }

      // Mark lesson as completed
      if (isCompleted && !progress.completedLessons.includes(lessonId)) {
        progress.completedLessons = [...progress.completedLessons, lessonId];
      }

      // Calculate progress percentage
      const totalLessons = await Lesson.count({
        where: { LectureId: lesson.LectureId }
      });
      
      progress.progressPercentage = (progress.completedLessons.length / totalLessons) * 100;
      progress.isCompleted = progress.progressPercentage === 100;

      await progress.save();

      res.status(200).json({
        success: true,
        data: progress
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user progress for a course
  static async getUserProgress(req, res, next) {
    try {
      const { lectureId } = req.params;
      const userId = req.user.id;

      const progress = await UserProgress.findOne({
        where: {
          UserId: userId,
          LectureId: lectureId
        },
        include: [{
          model: Lesson,
          as: 'currentLesson',
          attributes: ['id', 'title', 'order']
        }]
      });

      if (!progress) {
        return res.status(404).json({
          success: false,
          message: 'No progress found for this course'
        });
      }

      res.status(200).json({
        success: true,
        data: progress
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LessonController;
