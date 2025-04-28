"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Lecture extends Model {
    static associate(models) {
      // Relasi Lecture → Category (Many-to-One)
      Lecture.belongsTo(models.Category, {
        foreignKey: "CategoryId",
        as: "category",
      });
      // Relasi Lecture → User (Many-to-One, untuk pengelola lecture)
      Lecture.belongsTo(models.User);
      // Relasi Lecture ↔ User (Many-to-Many melalui Cart)
      Lecture.belongsToMany(models.User, {
        through: models.Cart,
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
    },
    {
      sequelize,
      modelName: "Lecture",
    }
  );
  return Lecture;
};
