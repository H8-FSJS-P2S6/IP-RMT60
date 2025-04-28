const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

class UserController {
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
        address
      });

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw { name: "BadRequest", message: "Email and password are required" };
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
        role: user.role
      };

      const access_token = generateToken(payload);

      res.status(200).json({
        access_token,
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      });
    } catch (err) {
      next(err);
    }
  }

  static async getUserProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
      
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;