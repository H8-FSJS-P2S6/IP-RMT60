const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      return next(); // Allow public routes to proceed
    }

    const payload = verifyToken(access_token);

    const user = await User.findByPk(payload.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Changed to 404
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authentication;
