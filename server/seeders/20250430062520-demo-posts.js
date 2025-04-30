'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Posts', [
      {
        driverId: 1,
        truckType: 'Box',
        maxWeight: 1000,
        origin: 'Jakarta',
        destination: 'Bandung',
        availableDate: '2025-05-01',
        availableTime: '10:00',
        shippingCost: 500000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  }
};