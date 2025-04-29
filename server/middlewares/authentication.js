const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

async function authentication(req, res, next) {
  try {
    // Get token from request header
    const { authorization } = req.headers;
    
    if (!authorization) {
      throw { name: "Unauthorized", message: "Authentication token required" };
    }
    
    // Format: "Bearer token"
    const token = authorization.split(" ")[1];
    if (!token) {
      throw { name: "Unauthorized", message: "Invalid token format" };
    }
    
    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }
    
    // Find user based on token
    const user = await User.findByPk(payload.id);
    if (!user) {
      throw { name: "Unauthorized", message: "User not found" };
    }
    
    // Set req.user to be used in controller
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authentication;
