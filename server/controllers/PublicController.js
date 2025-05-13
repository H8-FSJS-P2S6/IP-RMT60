const { User, Role, ShippingAddress } = require("../models/index");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const {
  loginSchema,
  createUserSchema,
} = require("../validation/user.validation");
const {
  createShippingAddressSchema,
} = require("../validation/shippingAddress.validation");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const { generateContent } = require("../helpers/gemini");

class PublicConroller {
  static async register(req, res, next) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw { name: "BadRequest", message: "Request body is required" };
      }

      const { error } = createUserSchema.validate(req.body);
      if (error) {
        throw { name: "BadRequest", message: error.message };
      }

      const user = await User.create(req.body);
      const userWithoutPassword = user.get({ plain: true });
      delete userWithoutPassword.password;

      res.status(201).json({ data: userWithoutPassword });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw { name: "BadRequest", message: "Request body is required" };
      }

      const { error } = loginSchema.validate(req.body);
      if (error) {
        throw { name: "BadRequest", message: error.message };
      }

      const { email, password } = req.body;

      const user = await User.findOne({
        include: {
          model: Role,
          as: "Roles",
          attributes: ["name"],
        },
        where: { email },
      });

      if (!user) {
        throw {
          name: "Unauthorized",
          message: "Invalid email or password",
        };
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw {
          name: "Unauthorized",
          message: "Invalid email or password",
        };
      }

      const roles = Array.isArray(user.Roles)
        ? user.Roles.map((role) => role.name)
        : [];

      const access_token = signToken({
        id: user.id,
        roles: roles,
      });
      res.status(200).json({ access_token });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { googleToken } = req.body;

      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.WEB_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      let user = await User.findOne({
        include: {
          model: Role,
          as: "Roles",
          attributes: ["name"],
        },
        where: { email: payload.email },
      });

      if (!user) {
        user = await User.create({
          email: payload.email,
          name: payload.name,
          profilePicture: payload.picture,
          password: "password" + Math.random().toString(),
        });
      }

      const roles = Array.isArray(user.Roles)
        ? user.Roles.map((role) => role.name)
        : [];

      const access_token = signToken({
        id: user.id,
        roles: roles,
      });
      res.status(200).json({ access_token });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async chatWithAI(req, res, next) {
    try {
      const { message } = req.body; // Misalnya pesan yang dikirim oleh pengguna

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Gunakan helper untuk generate konten
      const aiResponse = await generateContent(message);
      return res.json({ reply: aiResponse });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async createShippingAddress(req, res, next) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw { name: "BadRequest", message: "Request body is required" };
      }

      const { error, value } = createShippingAddressSchema.validate(req.body);
      if (error) {
        throw { name: "BadRequest", message: error.message };
      }

      const shippingAddress = await ShippingAddress.create({
        ...value,
        UserId: req.user.id,
      });

      res.status(201).json({ data: shippingAddress });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = PublicConroller;
