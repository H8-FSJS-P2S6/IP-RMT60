'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'driver@gmail.com',
        password: await bcrypt.hash('driver123', 10),
        role: 'driver',
        name: 'Test Driver',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'user@gmail.com',
        password: await bcrypt.hash('user123', 10),
        role: 'user',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};