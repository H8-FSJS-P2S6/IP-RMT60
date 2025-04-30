'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Driver',
        email: 'driver@gmail.com',
        password: await bcrypt.hash('driver123', 10),
        role: 'driver',
        phone: '+6281234567890',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'User',
        email: 'user@gmail.com',
        password: await bcrypt.hash('user123', 10),
        role: 'user',
        phone: '+6280987654321',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};