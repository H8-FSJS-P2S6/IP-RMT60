"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Relasi User → Lecture (One-to-Many, untuk pengelola lecture)
      User.hasMany(models.Lecture);
      // Relasi User ↔ Lecture (Many-to-Many melalui Cart)
      User.belongsToMany(models.Lecture, {
        through: models.Cart,
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Username cannot be empty" },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email already exists" },
        validate: {
          notEmpty: { msg: "Email cannot be empty" },
          isEmail: { msg: "Invalid email format" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Password cannot be empty" },
          len: {
            args: [6, 128],
            msg: "Password must be between 6 and 128 characters",
          },
        },
      },
      role: {
        type: DataTypes.ENUM("Admin", "User"),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Role cannot be empty" },
          isIn: {
            args: [["Admin", "User"]],
            msg: "Role must be either Admin or User",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Phone number cannot be empty" },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Address cannot be empty" },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user) => {
    // Hash password before creating user
    user.password = hashPassword(user.password);
  });
  return User;
};
