const {
  XiaomiDevice,
  Sequelize: { Op },
} = require("../models");

class PubController {
  static async getAllDevices(req, res) {
    try {
      const { search, sort, minPrice, maxPrice } = req.query;

      // Build the query options
      let queryOptions = {};

      // Search functionality
      if (search) {
        queryOptions.where = {
          [Op.or]: [
            { device_name: { [Op.iLike]: `%${search}%` } },
            { key: { [Op.iLike]: `%${search}%` } },
          ],
        };
      }

      // Price filter
      if (minPrice || maxPrice) {
        queryOptions.where = {
          ...queryOptions.where,
          price: {},
        };
        if (minPrice) queryOptions.where.price[Op.gte] = minPrice;
        if (maxPrice) queryOptions.where.price[Op.lte] = maxPrice;
      }

      // Sort functionality
      if (sort) {
        const [field, order] = sort.split(":");
        const validFields = ["price", "device_name"];
        const validOrders = ["asc", "desc"];

        if (validFields.includes(field) && validOrders.includes(order)) {
          queryOptions.order = [[field, order.toUpperCase()]];
        }
      }

      const devices = await XiaomiDevice.findAll(queryOptions);

      // Map to limited device info
      const limitedDevices = devices.map((device) => ({
        id: device.id,
        key: device.key,
        device_name: device.device_name,
        device_image: device.device_image,
        price: device.price,
      }));

      res.status(200).json(limitedDevices);
    } catch (error) {
      console.error("Error in getAllDevices:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method untuk mendapatkan detail satu device berdasarkan ID dengan informasi lengkap
  static async getDeviceById(req, res) {
    try {
      const { id } = req.params;

      const device = await XiaomiDevice.findByPk(id);

      if (!device) {
        return res.status(404).json({ message: "Device tidak ditemukan" });
      }

      // Kirim semua informasi device
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = PubController;
