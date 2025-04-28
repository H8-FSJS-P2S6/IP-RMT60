"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Username cannot be empty" },
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: { msg: "Email already exists" },
        validate: {
          notEmpty: { msg: "Email cannot be empty" },
          isEmail: { msg: "Invalid email format" },
        },
      },
      password: {
        type: Sequelize.STRING,
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
        type: Sequelize.ENUM("Admin", "User"),
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
        type: Sequelize.STRING, // Ubah dari INTEGER ke STRING
        allowNull: false,
        validate: {
          notEmpty: { msg: "Phone number cannot be empty" },
        },
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Address cannot be empty" },
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
