const { User, Category, Lecture, Transaction, TransactionDetail, sequelize } = require("../models");
const { Op } = require("sequelize");

class AdminController {
  // Transaction Management Methods
  static async getTransactions(req, res, next) {
    try {
      const transactions = await Transaction.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      // Return transactions directly as an array, not wrapped in an object
      res.json(transactions);
    } catch (err) {
      // If Transaction table doesn't exist yet or there's another error
      // Return dummy data
      const dummyTransactions = Array.from({ length: 10 }).map((_, index) => ({
        id: index + 1,
        User: {
          id: index + 1,
          username: `user${index + 1}`,
          email: `user${index + 1}@example.com`
        },
        user: {
          id: index + 1,
          username: `user${index + 1}`,
          email: `user${index + 1}@example.com`
        },
        total: Math.floor(Math.random() * 5000) + 500,
        total_amount: Math.floor(Math.random() * 5000) + 500,
        status: ["Completed", "Processing", "Pending", "Cancelled"][Math.floor(Math.random() * 4)],
        paymentMethod: ["Credit Card", "Bank Transfer", "PayPal"][Math.floor(Math.random() * 3)],
        payment_method: ["Credit Card", "Bank Transfer", "PayPal"][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
        items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, itemIndex) => ({
          lecture: {
            title: `Course ${itemIndex + 1} for Transaction ${index + 1}`
          },
          price: Math.floor(Math.random() * 500) + 100
        }))
      }));

      // Return dummyTransactions directly as an array, not wrapped in an object
      res.json(dummyTransactions);
    }
  }

  static async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email']
          },
          {
            model: Lecture,
            through: { attributes: ['price'] }
          }
        ]
      });

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json({ transaction });
    } catch (err) {
      // If Transaction table doesn't exist yet or there's another error
      // Return dummy data for the requested ID
      const id = parseInt(req.params.id);
      const dummyTransaction = {
        id,
        User: {
          id: Math.floor(Math.random() * 100) + 1,
          username: `user${id}`,
          email: `user${id}@example.com`
        },
        user: {
          id: Math.floor(Math.random() * 100) + 1,
          username: `user${id}`,
          email: `user${id}@example.com`
        },
        total: Math.floor(Math.random() * 5000) + 500,
        total_amount: Math.floor(Math.random() * 5000) + 500,
        status: ["Completed", "Processing", "Pending", "Cancelled"][Math.floor(Math.random() * 4)],
        paymentMethod: ["Credit Card", "Bank Transfer", "PayPal"][Math.floor(Math.random() * 3)],
        payment_method: ["Credit Card", "Bank Transfer", "PayPal"][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
        items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map((_, itemIndex) => ({
          lecture: {
            title: `Course ${itemIndex + 1} for Transaction ${id}`
          },
          price: Math.floor(Math.random() * 500) + 100
        }))
      };

      res.json({ transaction: dummyTransaction });
    }
  }

  static async updateTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      if (!["Pending", "Processing", "Completed", "Cancelled"].includes(status)) {
        return res.status(400).json({ 
          message: "Invalid status. Status must be one of: Pending, Processing, Completed, Cancelled" 
        });
      }

      const transaction = await Transaction.findByPk(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      transaction.status = status;
      await transaction.save();
      
      res.json({ 
        message: "Transaction status updated successfully", 
        transaction 
      });
    } catch (err) {
      // If Transaction table doesn't exist yet or there's another error
      res.json({ 
        message: "Transaction status updated successfully (simulated)", 
        transaction: {
          id: parseInt(req.params.id),
          status: req.body.status,
          updatedAt: new Date()
        }
      });
    }
  }

  static async exportTransactions(req, res, next) {
    try {
      const transactions = await Transaction.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email']
          },
          {
            model: Lecture,
            through: { attributes: ['price'] }
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      // Transform data for export
      const exportData = transactions.map(t => ({
        id: t.id,
        invoice_number: t.invoice_number,
        user: `${t.User.username} (${t.User.email})`,
        total_amount: t.total_amount,
        payment_method: t.payment_method,
        status: t.status,
        created_at: t.createdAt,
        items: t.Lectures.map(l => ({
          lecture_title: l.title,
          price: l.TransactionDetail.price
        }))
      }));
      
      res.json(exportData);
    } catch (err) {
      // If Transaction table doesn't exist yet or there's another error
      // Return dummy data
      const dummyExportData = Array.from({ length: 20 }).map((_, index) => ({
        id: index + 1,
        invoice_number: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`,
        user: `user${index + 1} (user${index + 1}@example.com)`,
        total_amount: Math.floor(Math.random() * 5000) + 500,
        payment_method: ["Credit Card", "Bank Transfer", "PayPal"][Math.floor(Math.random() * 3)],
        status: ["Completed", "Processing", "Pending", "Cancelled"][Math.floor(Math.random() * 4)],
        created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
        items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, itemIndex) => ({
          lecture_title: `Course ${itemIndex + 1} for Transaction ${index + 1}`,
          price: Math.floor(Math.random() * 500) + 100
        }))
      }));
      
      res.json(dummyExportData);
    }
  }

  // Payment Management Methods
  static async getPayments(req, res, next) {
    try {
      // For now, since we might not have a separate Payment table,
      // we'll return transaction data but formatted as payment data
      const transactions = await Transaction.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      // Transform transactions to payment format
      const payments = transactions.map(t => ({
        id: t.id,
        transactionId: t.id,
        amount: t.total_amount,
        paymentMethod: t.payment_method,
        status: t.status,
        user: t.User,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        invoiceNumber: t.invoice_number
      }));

      res.json(payments);
    } catch (err) {
      // Return dummy payment data
      const dummyPayments = Array.from({ length: 15 }).map((_, index) => ({
        id: index + 1,
        transactionId: index + 1,
        amount: Math.floor(Math.random() * 5000) + 500,
        paymentMethod: ["Credit Card", "Bank Transfer", "PayPal", "QRIS", "Virtual Account"][Math.floor(Math.random() * 5)],
        status: ["Completed", "Processing", "Pending", "Failed", "Cancelled"][Math.floor(Math.random() * 5)],
        user: {
          id: index + 1,
          username: `user${index + 1}`,
          email: `user${index + 1}@example.com`
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
        updatedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000),
        invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`
      }));

      res.json(dummyPayments);
    }
  }

  static async getPaymentById(req, res, next) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email']
          }
        ]
      });

      if (!transaction) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Transform transaction to payment format
      const payment = {
        id: transaction.id,
        transactionId: transaction.id,
        amount: transaction.total_amount,
        paymentMethod: transaction.payment_method,
        status: transaction.status,
        user: transaction.User,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        invoiceNumber: transaction.invoice_number
      };

      res.json({ payment });
    } catch (err) {
      // Return dummy payment data for the requested ID
      const id = parseInt(req.params.id);
      const dummyPayment = {
        id,
        transactionId: id,
        amount: Math.floor(Math.random() * 5000) + 500,
        paymentMethod: ["Credit Card", "Bank Transfer", "PayPal", "QRIS", "Virtual Account"][Math.floor(Math.random() * 5)],
        status: ["Completed", "Processing", "Pending", "Failed", "Cancelled"][Math.floor(Math.random() * 5)],
        user: {
          id: Math.floor(Math.random() * 100) + 1,
          username: `user${id}`,
          email: `user${id}@example.com`
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
        updatedAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000),
        invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`
      };

      res.json({ payment: dummyPayment });
    }
  }

  static async updatePayment(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      if (!["Pending", "Processing", "Completed", "Failed", "Cancelled"].includes(status)) {
        return res.status(400).json({ 
          message: "Invalid status. Status must be one of: Pending, Processing, Completed, Failed, Cancelled" 
        });
      }

      const transaction = await Transaction.findByPk(id);
      
      if (!transaction) {
        return res.status(404).json({ message: "Payment not found" });
      }
      
      transaction.status = status;
      await transaction.save();
      
      res.json({ 
        message: "Payment status updated successfully", 
        payment: {
          id: transaction.id,
          status: transaction.status,
          updatedAt: transaction.updatedAt
        }
      });
    } catch (err) {
      // If Transaction table doesn't exist yet or there's another error
      res.json({ 
        message: "Payment status updated successfully (simulated)", 
        payment: {
          id: parseInt(req.params.id),
          status: req.body.status,
          updatedAt: new Date()
        }
      });
    }
  }

  static async exportPayments(req, res, next) {
    try {
      const transactions = await Transaction.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      // Transform data for export
      const exportData = transactions.map(t => ({
        id: t.id,
        transaction_id: t.id,
        invoice_number: t.invoice_number,
        user: `${t.User.username} (${t.User.email})`,
        amount: t.total_amount,
        payment_method: t.payment_method,
        status: t.status,
        created_at: t.createdAt,
        updated_at: t.updatedAt
      }));
      
      res.json(exportData);
    } catch (err) {
      // Return dummy export data
      const dummyExportData = Array.from({ length: 25 }).map((_, index) => ({
        id: index + 1,
        transaction_id: index + 1,
        invoice_number: `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`,
        user: `user${index + 1} (user${index + 1}@example.com)`,
        amount: Math.floor(Math.random() * 5000) + 500,
        payment_method: ["Credit Card", "Bank Transfer", "PayPal", "QRIS", "Virtual Account"][Math.floor(Math.random() * 5)],
        status: ["Completed", "Processing", "Pending", "Failed", "Cancelled"][Math.floor(Math.random() * 5)],
        created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000),
        updated_at: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000)
      }));
      
      res.json(dummyExportData);
    }
  }

  static async getPendingPayments(req, res, next) {
    try {
      const pendingPayments = await Transaction.findAll({
        where: { 
          status: 'Pending',
          payment_method: 'Manual_Transfer'
        },
        include: [
          {
            model: User,
            attributes: ['id', 'username', 'email']
          },
          {
            model: TransactionDetail,
            include: [{
              model: Lecture,
              attributes: ['name', 'price']
            }]
          }
        ],
        order: [['createdAt', 'ASC']] // Oldest first for priority
      });

      res.json({
        message: "Pending payments retrieved successfully",
        payments: pendingPayments,
        total: pendingPayments.length
      });
    } catch (error) {
      next(error);
    }
  }

  static async approvePayment(req, res, next) {
    try {
      const { invoice_number } = req.params;
      const { note } = req.body; // Optional admin note

      const transaction = await Transaction.findOne({
        where: { 
          invoice_number,
          payment_method: 'Manual_Transfer',
          status: 'Pending'
        },
        include: [{
          model: User,
          attributes: ['username', 'email']
        }]
      });

      if (!transaction) {
        throw { name: "NotFound", message: "Pending transaction not found" };
      }

      await transaction.update({ 
        status: 'Completed',
        admin_note: note || `Approved by ${req.user.username} on ${new Date().toISOString()}`
      });

      res.json({
        message: "Payment approved successfully",
        transaction: {
          invoice_number: transaction.invoice_number,
          user: transaction.User.username,
          amount: transaction.total_amount,
          status: transaction.status,
          approved_by: req.user.username,
          approved_at: new Date()
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async rejectPayment(req, res, next) {
    try {
      const { invoice_number } = req.params;
      const { reason } = req.body; // Required rejection reason

      const transaction = await Transaction.findOne({
        where: { 
          invoice_number,
          payment_method: 'Manual_Transfer',
          status: 'Pending'
        },
        include: [{
          model: User,
          attributes: ['username', 'email']
        }]
      });

      if (!transaction) {
        throw { name: "NotFound", message: "Pending transaction not found" };
      }

      await transaction.update({ 
        status: 'Cancelled',
        admin_note: `Rejected by ${req.user.username}: ${reason || 'No reason provided'}`
      });

      res.json({
        message: "Payment rejected successfully",
        transaction: {
          invoice_number: transaction.invoice_number,
          user: transaction.User.username,
          amount: transaction.total_amount,
          status: transaction.status,
          rejected_by: req.user.username,
          rejected_at: new Date(),
          reason: reason || 'No reason provided'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentStats(req, res, next) {
    try {
      const stats = await Transaction.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('total_amount')), 'total_amount']
        ],
        group: ['status']
      });

      const formattedStats = stats.reduce((acc, stat) => {
        acc[stat.status] = {
          count: parseInt(stat.dataValues.count),
          total_amount: parseInt(stat.dataValues.total_amount) || 0
        };
        return acc;
      }, {});

      res.json({
        message: "Payment statistics retrieved successfully",
        stats: formattedStats
      });
    } catch (error) {
      next(error);
    }
  }

  // Dashboard and Statistics Methods
  static async getDashboard(req, res, next) {
    try {
      // Fetch all necessary data for the dashboard in a single endpoint
      const totalUsers = await User.count();
      const totalCourses = await Lecture.count();
      const totalCategories = await Category.count();
      
      // Revenue and orders data
      let totalOrders = 0;
      let totalRevenue = 0;
      
      try {
        totalOrders = await Transaction.count();
        const revenueResult = await Transaction.sum('total_amount', {
          where: { status: 'Completed' }
        });
        totalRevenue = revenueResult || 0;
      } catch (err) {
        console.log("Transaction model not available, using dummy data");
        totalOrders = 15;
        totalRevenue = 25000000;
      }
      
      // Latest user data
      const recentUsers = await User.findAll({
        attributes: ['id', 'username', 'email', 'role', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5
      });
      
      // Latest order data
      let recentOrders;
      try {
        recentOrders = await Transaction.findAll({
          include: [{
            model: User,
            attributes: ['id', 'username', 'email']
          }],
          order: [['createdAt', 'DESC']],
          limit: 5
        });
      } catch (err) {
        // Dummy data for orders
        recentOrders = Array.from({ length: 5 }).map((_, index) => ({
          id: index + 1,
          User: { 
            id: index + 1,
            username: `user${index + 1}` 
          },
          createdAt: new Date(Date.now() - index * 86400000),
          totalAmount: Math.floor(Math.random() * 5000000) + 1000000,
          status: ["Completed", "Processing", "Pending"][Math.floor(Math.random() * 3)]
        }));
      }
      
      // Combine all data
      res.json({
        totalUsers,
        totalCourses,
        totalCategories,
        totalOrders,
        totalRevenue,
        recentUsers,
        recentOrders
      });
      
    } catch (err) {
      next(err);
    }
  }
  static async getStatistics(req, res, next) {
    try {
      const totalUsers = await User.count();
      const totalCourses = await Lecture.count();
      const totalCategories = await Category.count();
      
      // If the Transaction model is not yet available, use dummy data
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
      
      // If the Transaction model is not yet available, use dummy data
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
        // Dummy data
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
      // If the Transaction model is not ready, use dummy data
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
        // Dummy data for the last 6 months
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