"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: "UserId" });
      Transaction.hasMany(models.TransactionDetail, {
        foreignKey: "TransactionId",
      });

      // Transaction can also have a many-to-many association with Lecture through TransactionDetail
      Transaction.belongsToMany(models.Lecture, {
        through: models.TransactionDetail,
        foreignKey: "TransactionId",
        otherKey: "LectureId",
      });
    }
  }
  Transaction.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User ID is required" },
          notEmpty: { msg: "User ID cannot be empty" },
        },
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Total amount is required" },
          min: {
            args: [0],
            msg: "Total amount cannot be negative",
          },
        },
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Bank Transfer",
        validate: {
          notEmpty: { msg: "Payment method cannot be empty" },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pending",
        validate: {
          isIn: {
            args: [["Pending", "Processing", "Completed", "Cancelled"]],
            msg: "Status must be one of: Pending, Processing, Completed, Cancelled",
          },
        },
      },
      invoice_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "Invoice number cannot be empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  Transaction.beforeValidate((transaction) => {
    if (!transaction.invoice_number) {
      // Format: INV-YYYYMMDD-XXXXX (X = random)
      const date = new Date();
      const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
      const random = Math.floor(10000 + Math.random() * 90000); // 5 digit random
      transaction.invoice_number = `INV-${dateStr}-${random}`;
    }
  });
  return Transaction;
};
