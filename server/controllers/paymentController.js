const {
  Transaction,
  User,
  Cart,
  TransactionDetail,
  Lecture,
  sequelize,
} = require("../models");
// const {
//   createPaymentToken,
//   handleNotification,
// } = require("../helpers/midtrans");

class PaymentController {
  // Create manual payment (WhatsApp + Bank Transfer)
  static async createManualPayment(req, res, next) {
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

      // Create new transaction for manual payment
      const transaction = await Transaction.create(
        {
          UserId,
          total_amount,
          payment_method: "Manual_Transfer",
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

      await t.commit();

      // Generate WhatsApp payment instructions
      const coursesList = cartItems.map(item => `• ${item.Lecture.name} - Rp ${item.Lecture.price.toLocaleString()}`).join('\n');
      
      const whatsappMessage = `🎓 *PEMBAYARAN KURSUS ONLINE*

📝 *Invoice:* ${invoice_number}
👤 *Nama:* ${user.username}
📧 *Email:* ${user.email}

📚 *Kursus yang dibeli:*
${coursesList}

💰 *Total Pembayaran:* Rp ${total_amount.toLocaleString()}

🏦 *Transfer ke rekening:*
*Bank BCA*
No. Rekening: 1234567890
Atas Nama: PT SAR NDT SERVICES

📋 *Cara Pembayaran:*
1. Transfer sesuai nominal di atas
2. Screenshot bukti transfer
3. Kirim screenshot ke chat ini
4. Sertakan invoice number: ${invoice_number}

⏰ *Batas Pembayaran:* 24 jam dari sekarang

Terima kasih! 🙏`;

      const whatsappUrl = `https://wa.me/6281296953557?text=${encodeURIComponent(whatsappMessage)}`;

      // Return payment details
      res.status(201).json({
        message: "Manual payment order created successfully",
        transaction: {
          id: transaction.id,
          invoice_number: transaction.invoice_number,
          total_amount: transaction.total_amount,
          status: transaction.status,
          payment_method: transaction.payment_method,
        },
        payment: {
          whatsapp_url: whatsappUrl,
          bank_details: {
            bank_name: "BCA",
            account_number: "1234567890",
            account_name: "PT SAR NDT SERVICES"
          },
          instructions: [
            "Transfer sesuai nominal yang tertera",
            "Screenshot bukti transfer",
            "Kirim via WhatsApp dengan menyertakan invoice number",
            "Pembayaran akan diverifikasi dalam 1x24 jam"
          ]
        },
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  // Confirm manual payment (admin use)
  static async confirmManualPayment(req, res, next) {
    try {
      const { invoice_number } = req.params;
      const { status } = req.body; // "Completed" or "Rejected"

      const transaction = await Transaction.findOne({
        where: { 
          invoice_number,
          payment_method: "Manual_Transfer"
        },
      });

      if (!transaction) {
        throw { name: "NotFound", message: "Manual transaction not found" };
      }

      await transaction.update({ 
        status: status === "Completed" ? "Completed" : "Cancelled" 
      });

      res.status(200).json({
        message: `Payment ${status.toLowerCase()} successfully`,
        transaction: {
          invoice_number: transaction.invoice_number,
          status: transaction.status
        }
      });
    } catch (error) {
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

  // ====== PAYMENT GATEWAY FEATURES (COMMENTED FOR FUTURE USE) ======
  // TODO: Uncomment these methods when ready to implement Midtrans payment gateway
  
  // static async createPayment(req, res, next) {
  //   // Midtrans payment implementation here
  //   // Will be uncommented when payment gateway is ready
  // }

  // static async handleNotification(req, res, next) {
  //   // Midtrans webhook notification handler
  //   // Will be uncommented when payment gateway is ready
  // }
  
  // ====== END OF COMMENTED PAYMENT GATEWAY FEATURES ======
}

module.exports = PaymentController;
