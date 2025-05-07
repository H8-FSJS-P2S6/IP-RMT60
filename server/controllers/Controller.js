const { XiaomiDevice, User, Favorite } = require("../models");

class Controller {
  // Method untuk mendapatkan semua device Xiaomi
  static async getAllDevices(req, res) {
    try {
      const devices = await XiaomiDevice.findAll();

      // Mengecek apakah user sudah login atau belum
      const isLoggedIn = req.user ? true : false;

      // Jika user belum login, hanya kirim informasi terbatas
      if (!isLoggedIn) {
        const limitedDevices = devices.map((device) => {
          return {
            id: device.id,
            key: device.key,
            device_name: device.device_name,
            device_image: device.device_image,
            price: device.price,
          };
        });

        return res.status(200).json(limitedDevices);
      }

      // Jika user sudah login, kirim semua informasi device
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method untuk mendapatkan detail satu device berdasarkan ID
  static async getDeviceById(req, res) {
    try {
      const { id } = req.params;

      const device = await XiaomiDevice.findByPk(id);

      if (!device) {
        return res.status(404).json({ message: "Device tidak ditemukan" });
      }

      // Mengecek apakah user sudah login atau belum
      const isLoggedIn = req.user ? true : false;

      // Jika user belum login, hanya kirim informasi terbatas
      if (!isLoggedIn) {
        const limitedDevice = {
          id: device.id,
          key: device.key,
          device_name: device.device_name,
          device_image: device.device_image,
          price: device.price,
        };

        return res.status(200).json(limitedDevice);
      }

      // Jika user sudah login, kirim semua informasi device
      res.status(200).json(device);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method untuk menambahkan device ke daftar favorit
  static async addToFavorites(req, res) {
    try {
      const UserId = req.user.id; // Diambil dari middleware authentication
      const { XiaomiDeviceId } = req.params;

      // Memastikan device ada
      const device = await XiaomiDevice.findByPk(XiaomiDeviceId);

      if (!device) {
        return res.status(404).json({ message: "Device tidak ditemukan" });
      }

      // Mengecek apakah device sudah ada di daftar favorit user
      const existingFavorite = await Favorite.findOne({
        where: { UserId, XiaomiDeviceId },
      });

      if (existingFavorite) {
        return res
          .status(400)
          .json({ message: "Device sudah ada di daftar favorit Anda" });
      }

      // Menambahkan device ke daftar favorit
      await Favorite.create({ UserId, XiaomiDeviceId });

      res
        .status(201)
        .json({ message: "Device berhasil ditambahkan ke favorit" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method untuk mendapatkan daftar favorit user
  static async getFavorites(req, res) {
    try {
      const UserId = req.user.id; // Add this line to get UserId from authenticated request

      const favorites = await Favorite.findAll({
        where: { UserId },
        include: [XiaomiDevice],
      });

      const favoriteDevices = favorites.map((fav) => fav.XiaomiDevice);

      res.status(200).json(favoriteDevices);
    } catch (error) {
      console.error(error); // Add logging for debugging
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method untuk menghapus device dari daftar favorit
  static async removeFromFavorites(req, res) {
    try {
      const UserId = req.user.id; // Diambil dari middleware authentication
      const { XiaomiDeviceId } = req.params;

      // Memastikan device ada di daftar favorit user
      const favorite = await Favorite.findOne({
        where: { UserId, XiaomiDeviceId },
      });

      if (!favorite) {
        return res
          .status(404)
          .json({ message: "Device tidak ada di daftar favorit Anda" });
      }

      // Menghapus device dari daftar favorit
      await favorite.destroy();

      res.status(200).json({ message: "Device berhasil dihapus dari favorit" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

module.exports = Controller;
