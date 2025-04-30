const {
  Transaction,
  User,
  Cart,
  TransactionDetail,
  Lecture,
  sequelize,
} = require("../models");
const {
  createPaymentToken,
  handleNotification,
} = require("../helpers/midtrans");

class PaymentController {
  // Create payment for a transaction
  static async createPayment(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const UserId = req.user.id;

      // Get user details
      const user = await User.findByPk(UserId);
      if (!user) {
        throw { name: "NotFound", message: "User not found" };
      }

      // Get cart items
      const cartItems = await Cart.findAll({
        where: { UserId },
        include: [{ model: Lecture }],
        transaction: t,
      });

      if (!cartItems.length) {
        throw { name: "BadRequest", message: "Your cart is empty" };
      }

      // Calculate total amount
      const total_amount = cartItems.reduce(
        (sum, item) => sum + item.Lecture.price,
        0
      );

      // Generate unique invoice number
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
      const random = Math.floor(10000 + Math.random() * 90000); // 5 digit random
      const invoice_number = `INV-${dateStr}-${random}`;

      // Create new transaction
      const transaction = await Transaction.create(
        {
          UserId,
          total_amount,
          payment_method: "Midtrans",
          status: "Pending",
          invoice_number,
        },
        { transaction: t }
      );

      // Create transaction details
      const transactionDetails = cartItems.map((item) => ({
        TransactionId: transaction.id,
        LectureId: item.Lecture.id,
        price: item.Lecture.price,
      }));

      await TransactionDetail.bulkCreate(transactionDetails, {
        transaction: t,
      });

      // Clear cart
      await Cart.destroy({
        where: { UserId },
        transaction: t,
      });

      // Create Midtrans payment token
      const transactionWithUser = {
        ...transaction.toJSON(),
        User: user,
      };

      const paymentToken = await createPaymentToken(transactionWithUser);

      await t.commit();

      // Return payment details
      res.status(201).json({
        message: "Payment initiated successfully",
        transaction: {
          id: transaction.id,
          invoice_number: transaction.invoice_number,
          total_amount: transaction.total_amount,
          status: transaction.status,
        },
        payment: paymentToken,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  // Handle notification from Midtrans
  static async handleNotification(req, res, next) {
    try {
      const notificationJson = req.body;

      const { orderId, transactionStatus, fraudStatus } =
        await handleNotification(notificationJson);

      // Find our transaction by invoice number (order_id in Midtrans)
      const transaction = await Transaction.findOne({
        where: { invoice_number: orderId },
      });

      if (!transaction) {
        throw { name: "NotFound", message: "Transaction not found" };
      }

      // Update transaction status based on Midtrans status
      let newStatus;

      if (transactionStatus == "capture") {
        if (fraudStatus == "accept") {
          newStatus = "Completed";
        } else if (fraudStatus == "challenge") {
          newStatus = "Processing";
        }
      } else if (transactionStatus == "settlement") {
        newStatus = "Completed";
      } else if (transactionStatus == "pending") {
        newStatus = "Pending";
      } else if (
        transactionStatus == "deny" ||
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
        newStatus = "Cancelled";
      } else if (transactionStatus == "refund") {
        newStatus = "Refunded";
      }

      if (newStatus) {
        await transaction.update({ status: newStatus });
      }

      res.status(200).json({ message: "Notification processed" });
    } catch (error) {
      console.error("Error processing notification:", error);
      next(error);
    }
  }

  // Get payment status by invoice number
  static async getPaymentStatus(req, res, next) {
    try {
      const { invoice } = req.params;

      const transaction = await Transaction.findOne({
        where: { invoice_number: invoice },
        include: [
          {
            model: User,
            attributes: ["id", "username", "email"],
          },
          {
            model: TransactionDetail,
            include: [{ model: Lecture }],
          },
        ],
      });

      if (!transaction) {
        throw { name: "NotFound", message: "Transaction not found" };
      }

      // Check if user is authorized to view this transaction
      if (transaction.UserId !== req.user.id && req.user.role !== "Admin") {
        throw {
          name: "Forbidden",
          message: "You are not authorized to view this transaction",
        };
      }

      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
