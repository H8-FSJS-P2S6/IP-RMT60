"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lecture extends Model {
    static associate(models) {
      Lecture.belongsTo(models.Category, {
        foreignKey: "CategoryId",
        as: "category",
      });
      Lecture.belongsTo(models.User);
      Lecture.belongsToMany(models.User, {
        through: models.Cart,
      });
      Lecture.hasMany(models.TransactionDetail, { foreignKey: "LectureId" });
      Lecture.belongsToMany(models.Transaction, {
        through: models.TransactionDetail,
        foreignKey: "LectureId",
        otherKey: "TransactionId",
      });
      Lecture.hasMany(models.Lesson, {
        foreignKey: "LectureId",
        as: "lessons"
      });
      Lecture.hasMany(models.UserProgress, {
        foreignKey: "LectureId",
        as: "userProgresses"
      });
    }
  }
  Lecture.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Instructor name cannot be empty" },
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Title cannot be empty" },
        },
      },
      technique: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Technique cannot be empty" },
        },
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      experience_years: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [0], msg: "Experience years cannot be negative" },
        },
      },
      certifications: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Certifications cannot be empty" },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Description cannot be empty" },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [0], msg: "Price cannot be negative" },
        },
      },
      availability: {
        type: DataTypes.ENUM("Available", "Limited", "Unavailable"),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Availability cannot be empty" },
          isIn: {
            args: [["Available", "Limited", "Unavailable"]],
            msg: "Availability must be Available, Limited, or Unavailable",
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Image URL cannot be empty" },
          isUrl: { msg: "Invalid image URL format" },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Lecture",
    }
  );
  return Lecture;
};
