"use strict";
const { hashPassword } = require("../helpers/bcrypt");
const fs = require("fs").promises;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const user = JSON.parse(await fs.readFile("./data/users.json")).map(
      (el) => {
        delete el.id;
        el.createdAt = el.updatedAt = new Date();
        el.password = hashPassword(el.password);
        return el;
      }
    );
    const category = JSON.parse(
      await fs.readFile("./data/categories.json")
    ).map((el) => {
      delete el.id;
      el.createdAt = el.updatedAt = new Date();
      return el;
    });
    const lecture = JSON.parse(await fs.readFile("./data/lectures.json")).map(
      (el) => {
        delete el.id;
        el.createdAt = el.updatedAt = new Date();
        return el;
      }
    );
    const cart = JSON.parse(await fs.readFile("./data/carts.json")).map(
      (el) => {
        delete el.id;
        el.createdAt = el.updatedAt = new Date();
        return el;
      }
    );
    await queryInterface.bulkInsert("Users", user, {});
    await queryInterface.bulkInsert("Categories", category, {});
    await queryInterface.bulkInsert("Lectures", lecture, {});
    await queryInterface.bulkInsert("Carts", cart, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Carts", null, {});
    await queryInterface.bulkDelete("Lectures", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
