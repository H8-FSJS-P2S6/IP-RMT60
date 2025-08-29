const { Transaction, TransactionDetail } = require('../models');

const checkCourseAccess = async (req, res, next) => {
  try {
    const { id: lectureId } = req.params;
    const UserId = req.user.id;

    // Check if user has completed transaction for this course
    const hasAccess = await Transaction.findOne({
      where: { 
        UserId,
        status: 'Completed' // Only completed payments
      },
      include: [{
        model: TransactionDetail,
        where: { LectureId: lectureId }
      }]
    });

    if (!hasAccess) {
      return res.status(403).json({
        message: "Course access denied. Please complete payment first.",
        redirect: "/cart",
        accessDenied: true
      });
    }

    // Add access info to request for further processing
    req.courseAccess = {
      transactionId: hasAccess.id,
      invoiceNumber: hasAccess.invoice_number,
      grantedAt: hasAccess.updatedAt
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to check if user owns any courses
const checkUserCourses = async (req, res, next) => {
  try {
    const UserId = req.user.id;

    const userCourses = await Transaction.findAll({
      where: { 
        UserId,
        status: 'Completed'
      },
      include: [{
        model: TransactionDetail,
        include: ['Lecture']
      }]
    });

    req.userCourses = userCourses;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  checkCourseAccess,
  checkUserCourses
};
