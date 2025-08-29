"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Lectures", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Instructor name cannot be empty" },
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Title cannot be empty" },
        },
      },
      technique: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Technique cannot be empty" },
        },
      },
      CategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Categories", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      experience_years: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [0], msg: "Experience years cannot be negative" },
        },
      },
      certifications: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Certifications cannot be empty" },
        },
      },
      description: {
        type: Sequelize.TEXT, // Ubah dari STRING ke TEXT
        allowNull: false,
        validate: {
          notEmpty: { msg: "Description cannot be empty" },
        },
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [0], msg: "Price cannot be negative" },
        },
      },
      availability: {
        type: Sequelize.ENUM("Available", "Limited", "Unavailable"),
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
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Image URL cannot be empty" },
          isUrl: { msg: "Invalid image URL format" },
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
    await queryInterface.dropTable("Lectures");
  },
};
