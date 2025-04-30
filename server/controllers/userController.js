const { User } = require("../models");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const { Op } = require("sequelize");
const client = new OAuth2Client();
class UserController {
  static async googleLogin(req, res, next) {
    try {
      const { id_token } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      console.log(payload);

      let user = await User.findOne({ where: { email: payload.email } });
      if (!user) {
        user = await User.create({
          username: payload.name,
          email: payload.email,
          password: Math.random().toString(),
          role: "User",
          phoneNumber: payload.phoneNumber || "0808080808",
          address: payload.address || "unknown",
        });
      }
      const access_token = generateToken({ id: user.id });
      res.status(200).json({
        access_token,
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;

      // Default role for new registrations is "User"
      const newUser = await User.create({
        username,
        email,
        password, // Will be hashed by beforeCreate hook in model
        role: "User",
        phoneNumber,
        address,
      });

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw {
          name: "BadRequest",
          message: "Email and password are required",
        };
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw { name: "Unauthorized", message: "Invalid email or password" };
      }

      const isPasswordValid = comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw { name: "Unauthorized", message: "Invalid email or password" };
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const access_token = generateToken(payload);

      res.status(200).json({
        access_token,
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUserProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  // Untuk mendapatkan semua pengguna dengan pagination
  static async getAllUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const offset = (page - 1) * limit;

      const whereClause = {};
      if (search) {
        whereClause[Op.or] = [
          { username: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        users: rows,
        currentPage: page,
        totalPages,
        totalItems: count
      });
    } catch (err) {
      next(err);
    }
  }

  // Untuk membuat pengguna baru
  static async createUser(req, res, next) {
    try {
      const { username, email, role, phoneNumber, address } = req.body;

      // Generate random password
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = hashPassword(randomPassword);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || 'User',
        phoneNumber,
        address
      });

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;
      
      // In a real app, you would send an email with the temporary password
      // For demo, just return it (not secure for production)
      res.status(201).json({
        ...userResponse,
        temporaryPassword: randomPassword
      });
    } catch (err) {
      next(err);
    }
  }

  // Untuk update pengguna
  static async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email, role, phoneNumber, address } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        throw { name: "NotFound", message: "User not found" };
      }

      // Update user data
      await user.update({
        username,
        email,
        role,
        phoneNumber,
        address
      });

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(200).json(userResponse);
    } catch (err) {
      next(err);
    }
  }

  // Untuk menghapus pengguna
  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        throw { name: "NotFound", message: "User not found" };
      }

      // Don't allow deleting admin users
      if (user.role === "Admin") {
        throw { name: "Forbidden", message: "Cannot delete admin users" };
      }

      await user.destroy();

      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
