"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RolePermissions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      RoleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Roles",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      PermissionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Permissions",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
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
    await queryInterface.dropTable("RolePermissions");
  },
};
