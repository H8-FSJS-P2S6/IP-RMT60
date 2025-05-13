const { User } = require("../models/index");
const { createUserSchema } = require("../validations/user.validation");

module.exports = class UserController {
  static async addUser(req, res, next) {
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
};
