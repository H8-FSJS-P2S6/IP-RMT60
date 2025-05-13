'use strict';
const fs = require('fs').promises
const bcrypt = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = JSON.parse(await fs.readFile('./data/users.json', 'utf8')).map(el => {
      el.createdAt = el.updatedAt = new Date()
      el.password = bcrypt.hashSync(el.password, 10)
      return el
    })
    await queryInterface.bulkInsert('Users', data, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
  }
};
