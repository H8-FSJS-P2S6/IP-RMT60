"use strict";
const fs = require("fs");
const path = require("path");
const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Membaca data dari file JSON
    const rawData = fs.readFileSync(
      path.join(__dirname, "../data/list-user.json"),
      "utf-8"
    );
    const users = JSON.parse(rawData);

    // Membuat array of data yang akan dimasukkan ke database
    // Password akan di-hash menggunakan bcrypt helper
    const userData = users.map((user) => {
      return {
        username: user.username,
        email: user.email,
        password: hashPassword(user.password), // Hash password
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    // Memasukkan data ke tabel Users
    await queryInterface.bulkInsert("Users", userData, {});
  },

  async down(queryInterface, Sequelize) {
    // Menghapus semua data di tabel Users
    await queryInterface.bulkDelete("Users", null, {});
  },
};
