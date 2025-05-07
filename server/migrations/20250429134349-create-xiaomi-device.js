'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('XiaomiDevices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      key: {
        type: Sequelize.STRING
      },
      device_name: {
        type: Sequelize.STRING
      },
      device_image: {
        type: Sequelize.STRING
      },
      display_size: {
        type: Sequelize.STRING
      },
      display_res: {
        type: Sequelize.STRING
      },
      camera: {
        type: Sequelize.STRING
      },
      video: {
        type: Sequelize.STRING
      },
      ram: {
        type: Sequelize.STRING
      },
      chipset: {
        type: Sequelize.STRING
      },
      battery: {
        type: Sequelize.STRING
      },
      batteryType: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.STRING
      },
      os_type: {
        type: Sequelize.STRING
      },
      storage: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('XiaomiDevices');
  }
};