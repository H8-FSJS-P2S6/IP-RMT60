const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    // Check if token exists
    const { access_token } = req.headers;
    if (!access_token) {
      throw { name: "Unauthorized", message: "Please login first" };
    }

    // Verify token
    const payload = verifyToken(access_token);
    if (!payload) {
      throw { name: "JsonWebTokenError", message: "Invalid token" };
    }

    // Find user by id
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: "Unauthorized", message: "User not found" };
    }

    // Add user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;
