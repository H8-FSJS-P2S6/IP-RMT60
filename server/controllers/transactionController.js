const { Transaction, TransactionDetail, Lecture, User, sequelize } = require("../models");
const { v4: uuidv4 } = require('uuid');

class TransactionController {
  // Mendapatkan semua transaksi untuk admin
  static async getAllTransactions(req, res, next) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (status) {
        whereClause.status = status;
      }
      
      const { count, rows } = await Transaction.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          attributes: ['id', 'username', 'email']
        }],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      const totalPages = Math.ceil(count / limit);
      
      res.status(200).json({
        transactions: rows,
        currentPage: parseInt(page),
        totalPages,
        totalItems: count
      });
    } catch (err) {
      next(err);
    }
  }
  
  // Mendapatkan transaksi milik user yang sedang login
  static async getUserTransactions(req, res, next) {
    try {
      const UserId = req.user.id;
      
      const transactions = await Transaction.findAll({
        where: { UserId },
        include: [{
          model: TransactionDetail,
          include: [{
            model: Lecture,
            include: ['category']
          }]
        }],
        order: [['createdAt', 'DESC']]
      });
      
      res.status(200).json(transactions);
    } catch (err) {
      next(err);
    }
  }
  
  // Mendapatkan detail transaksi
  static async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;
      
      const transaction = await Transaction.findByPk(id, {
        include: [{
          model: TransactionDetail,
          include: [{
            model: Lecture,
            include: ['category']
          }]
        }, {
          model: User,
          attributes: ['id', 'username', 'email', 'phoneNumber']
        }]
      });
      
      if (!transaction) {
        throw { name: "NotFound", message: "Transaction not found" };
      }
      
      // Cek apakah transaksi milik user yang sedang login atau admin
      if (transaction.UserId !== req.user.id && req.user.role !== 'Admin') {
        throw { name: "Forbidden", message: "You don't have permission to access this transaction" };
      }
      
      res.status(200).json(transaction);
    } catch (err) {
      next(err);
    }
  }
  
  // Membuat transaksi baru dari cart
  static async createTransaction(req, res, next) {
    const t = await sequelize.transaction();
    
    try {
      const UserId = req.user.id;
      const { payment_method } = req.body;
      
      // Get cart items
      const cart = await Cart.findAll({
        where: { UserId },
        include: [{
          model: Lecture
        }]
      });
      
      if (cart.length === 0) {
        throw { name: "BadRequest", message: "Cart is empty" };
      }
      
      // Calculate total amount
      const total_amount = cart.reduce((sum, item) => sum + item.Lecture.price, 0);
      
      // Create transaction
      const transaction = await Transaction.create({
        UserId,
        total_amount,
        payment_method,
        status: 'Pending'
      }, { transaction: t });
      
      // Create transaction details
      const transactionDetails = cart.map(item => ({
        TransactionId: transaction.id,
        LectureId: item.LectureId,
        price: item.Lecture.price
      }));
      
      await TransactionDetail.bulkCreate(transactionDetails, { transaction: t });
      
      // Clear cart
      await Cart.destroy({
        where: { UserId },
        transaction: t
      });
      
      await t.commit();
      
      // Get complete transaction with details
      const newTransaction = await Transaction.findByPk(transaction.id, {
        include: [{
          model: TransactionDetail,
          include: [{
            model: Lecture
          }]
        }]
      });
      
      res.status(201).json(newTransaction);
    } catch (err) {
      await t.rollback();
      next(err);
    }
  }
  
  // Update status transaksi (admin only)
  static async updateTransactionStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const transaction = await Transaction.findByPk(id);
      
      if (!transaction) {
        throw { name: "NotFound", message: "Transaction not found" };
      }
      
      // Validasi status
      const validStatus = ['Pending', 'Processing', 'Completed', 'Cancelled'];
      if (!validStatus.includes(status)) {
        throw { name: "BadRequest", message: "Invalid status" };
      }
      
      await transaction.update({ status });
      
      res.status(200).json(transaction);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TransactionController;