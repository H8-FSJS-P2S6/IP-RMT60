const { Lecture, Category, User, Transaction, TransactionDetail } = require("../models");

class LectureController {
  static async getAllLectures(req, res, next) {
    try {
      const lectures = await Lecture.findAll({
        include: [
          {
            model: Category,
            as: "category"
          },
          {
            model: User,
            attributes: ["username", "email"]
          }
        ],
        order: [["id", "ASC"]]
      });
      
      res.status(200).json(lectures);
    } catch (err) {
      next(err);
    }
  }

  static async getLectureById(req, res, next) {
    try {
      const { id } = req.params;
      const lecture = await Lecture.findByPk(id, {
        include: [
          {
            model: Category,
            as: "category"
          },
          {
            model: User,
            attributes: ["username", "email"]
          }
        ]
      });
      
      if (!lecture) {
        throw { name: "NotFound", message: "Lecture not found" };
      }
      
      res.status(200).json(lecture);
    } catch (err) {
      next(err);
    }
  }

  static async createLecture(req, res, next) {
    try {
      const {
        name,
        title,
        technique,
        CategoryId,
        experience_years,
        certifications,
        description,
        price,
        availability,
        image
      } = req.body;
      
      // Set the current admin as the lecture creator
      const UserId = req.user.id;
      
      const newLecture = await Lecture.create({
        name,
        title,
        technique,
        CategoryId,
        experience_years,
        certifications,
        description,
        price,
        availability,
        image,
        UserId
      });
      
      res.status(201).json(newLecture);
    } catch (err) {
      next(err);
    }
  }

  static async updateLecture(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        title,
        technique,
        CategoryId,
        experience_years,
        certifications,
        description,
        price,
        availability,
        image
      } = req.body;
      
      const lecture = await Lecture.findByPk(id);
      
      if (!lecture) {
        throw { name: "NotFound", message: "Lecture not found" };
      }
      
      await lecture.update({
        name,
        title,
        technique,
        CategoryId,
        experience_years,
        certifications,
        description,
        price,
        availability,
        image
      });
      
      res.status(200).json(lecture);
    } catch (err) {
      next(err);
    }
  }

  static async deleteLecture(req, res, next) {
    try {
      const { id } = req.params;
      const lecture = await Lecture.findByPk(id);
      
      if (!lecture) {
        throw { name: "NotFound", message: "Lecture not found" };
      }
      
      await lecture.destroy();
      
      res.status(200).json({ message: "Lecture deleted successfully" });
    } catch (err) {
      next(err);
    }
  }

  // Get course content for paid users only
  static async getCourseContent(req, res, next) {
    try {
      const { id } = req.params;
      const UserId = req.user.id;

      // Double check access (middleware should handle this, but extra security)
      const transaction = await Transaction.findOne({
        where: { 
          UserId,
          status: 'Completed'
        },
        include: [{
          model: TransactionDetail,
          where: { LectureId: id }
        }]
      });

      if (!transaction) {
        throw { name: "Forbidden", message: "Please complete payment to access this course" };
      }

      const lecture = await Lecture.findByPk(id, {
        include: [
          {
            model: Category,
            as: "category"
          },
          {
            model: User,
            attributes: ["username", "email"]
          }
        ]
      });

      if (!lecture) {
        throw { name: "NotFound", message: "Lecture not found" };
      }
      
      res.json({
        message: "Course content accessed successfully",
        lecture,
        access_granted: true,
        transaction_info: {
          invoice_number: transaction.invoice_number,
          purchase_date: transaction.createdAt,
          payment_method: transaction.payment_method
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's purchased courses
  static async getUserCourses(req, res, next) {
    try {
      const UserId = req.user.id;

      console.log('Getting courses for user:', UserId);

      // First, let's check if user has any transactions at all
      const allTransactions = await Transaction.findAll({
        where: { UserId },
        attributes: ['id', 'status', 'total_amount', 'payment_method']
      });

      console.log('All user transactions:', allTransactions.length);

      const transactions = await Transaction.findAll({
        where: { 
          UserId,
          status: 'Completed'
        },
        include: [{
          model: TransactionDetail,
          include: [{
            model: Lecture,
            include: [{
              model: Category,
              as: "category"
            }]
          }]
        }],
        order: [['createdAt', 'DESC']]
      });

      console.log('Found completed transactions:', transactions.length);

      // If no completed transactions, return empty but successful response
      if (transactions.length === 0) {
        return res.json({
          message: "No completed purchases found",
          courses: [],
          total_courses: 0,
          debug: {
            userId: UserId,
            totalTransactions: allTransactions.length,
            completedTransactions: 0
          }
        });
      }

      // Flatten the data structure for easier frontend consumption
      const courses = [];
      transactions.forEach(transaction => {
        if (transaction.TransactionDetails && transaction.TransactionDetails.length > 0) {
          transaction.TransactionDetails.forEach(detail => {
            if (detail.Lecture) {
              courses.push({
                id: detail.Lecture.id,
                name: detail.Lecture.name,
                description: detail.Lecture.description,
                technique: detail.Lecture.technique,
                imgUrl: detail.Lecture.imgUrl,
                category: detail.Lecture.category,
                purchase_date: transaction.createdAt,
                invoice_number: transaction.invoice_number,
                payment_method: transaction.payment_method,
                access_granted: true
              });
            }
          });
        }
      });

      console.log('Processed courses:', courses.length);

      res.json({
        message: "User courses retrieved successfully",
        courses,
        total_courses: courses.length
      });
    } catch (error) {
      console.error('Error in getUserCourses:', error);
      res.status(500).json({ 
        message: "Internal server error",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}

module.exports = LectureController;