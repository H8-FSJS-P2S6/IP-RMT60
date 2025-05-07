"use strict";
const fs = require("fs");
const path = require("path");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Membaca data dari file JSON
    const rawData = fs.readFileSync(
      path.join(__dirname, "../data/list-hp-xiaomi.json"),
      "utf-8"
    );
    const devices = JSON.parse(rawData);

    // Membuat array of data yang akan dimasukkan ke database
    const xiaomiDevices = devices.map((device) => {
      return {
        key: device.key,
        device_name: device.device_name,
        device_image: device.device_image,
        display_size: device.display_size,
        display_res: device.display_res,
        camera: device.camera,
        video: device.video,
        ram: device.ram,
        chipset: device.chipset,
        battery: device.battery,
        batteryType: device.batteryType,
        body: device.body,
        os_type: device.os_type,
        storage: device.storage,
        comment: device.comment,
        price: device.price,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    // Memasukkan data ke tabel XiaomiDevices
    await queryInterface.bulkInsert("XiaomiDevices", xiaomiDevices, {});
  },

  async down(queryInterface, Sequelize) {
    // Menghapus semua data di tabel XiaomiDevices
    await queryInterface.bulkDelete("XiaomiDevices", null, {});
  },
};
