const { User, Category, Lecture, Transaction, sequelize } = require("../models");
const { Op } = require("sequelize");

class AdminController {
  static async getStatistics(req, res, next) {
    try {
      const totalUsers = await User.count();
      const totalCourses = await Lecture.count();
      const totalCategories = await Category.count();
      
      // Jika model Transaction belum ada, gunakan data dummy
      let totalOrders = 0;
      let revenue = 0;
      
      try {
        totalOrders = await Transaction.count();
        const revenueResult = await Transaction.sum('total_amount', {
          where: { status: 'Completed' }
        });
        revenue = revenueResult || 0;
      } catch (err) {
        console.log("Transaction model not available, using dummy data");
        totalOrders = 15;
        revenue = 25000000;
      }

      res.json({
        totalUsers,
        totalCourses,
        totalCategories,
        totalOrders,
        revenue
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRecentUsers(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      
      const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'role', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit
      });
      
      res.json(users);
    } catch (err) {
      next(err);
    }
  }

  static async getRecentOrders(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      
      // Jika model Transaction belum ada, gunakan data dummy
      try {
        const orders = await Transaction.findAll({
          include: [{
            model: User,
            attributes: ['id', 'username', 'email']
          }],
          order: [['createdAt', 'DESC']],
          limit
        });
        
        res.json(orders);
      } catch (err) {
        // Data dummy
        const dummyOrders = Array.from({ length: limit }).map((_, index) => ({
          id: index + 1,
          User: { 
            id: index + 1,
            username: `user${index + 1}` 
          },
          createdAt: new Date(Date.now() - index * 86400000),
          totalAmount: Math.floor(Math.random() * 5000000) + 1000000,
          status: ["Completed", "Processing", "Pending"][Math.floor(Math.random() * 3)]
        }));
        
        res.json(dummyOrders);
      }
    } catch (err) {
      next(err);
    }
  }

  static async getCategoriesStats(req, res, next) {
    try {
      const categories = await Category.findAll({
        attributes: [
          'id',
          'name',
          [sequelize.fn('COUNT', sequelize.col('Lectures.id')), 'courseCount']
        ],
        include: [{
          model: Lecture,
          attributes: []
        }],
        group: ['Category.id'],
        order: [[sequelize.fn('COUNT', sequelize.col('Lectures.id')), 'DESC']]
      });
      
      res.json(categories);
    } catch (err) {
      next(err);
    }
  }

  static async getMonthlySales(req, res, next) {
    try {
      // Jika Transaction model belum siap, gunakan data dummy
      try {
        const currentYear = new Date().getFullYear();
        
        const result = await Transaction.findAll({
          attributes: [
            [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'month'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount'],
            [sequelize.fn('SUM', sequelize.col('total_amount')), 'revenue']
          ],
          where: {
            createdAt: {
              [Op.gte]: new Date(`${currentYear}-01-01`),
              [Op.lt]: new Date(`${currentYear+1}-01-01`)
            },
            status: 'Completed'
          },
          group: [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt'))],
          order: [[sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'ASC']]
        });
        
        // Format data
        const monthlySales = result.map(item => {
          const data = item.toJSON();
          return {
            month: new Date(data.month).toLocaleString('en-US', { month: 'short' }),
            orderCount: parseInt(data.orderCount),
            revenue: parseInt(data.revenue)
          };
        });
        
        res.json(monthlySales);
      } catch (err) {
        // Data dummy untuk 6 bulan terakhir
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        
        const dummyData = months.map((month, index) => ({
          month,
          orderCount: Math.floor(Math.random() * 20) + 5,
          revenue: (Math.floor(Math.random() * 50) + 10) * 1000000
        }));
        
        res.json(dummyData);
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdminController;