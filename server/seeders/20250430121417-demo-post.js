'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Posts', [
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        departureDate: '2025-05-01',
        origin: 'Jakarta',
        destination: 'Surabaya',
        truckType: 'box',
        maxWeight: 1000,
        phoneNumber: '08123456789',
        driverId: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null, {});
  },
};