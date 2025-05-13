const { User, Role } = require("../models/index");
const { verifyToken } = require("../helpers/jwt");

module.exports = async function authentication(req, res, next) {
  console.log("~ authorization");
  const bearerToken = req.headers["authorization"];
  if (!bearerToken) {
    next({ name: "Unauthorized", message: "Invalid token" });
    return;
  }

  const [type, token] = bearerToken.split(" ");
  if (!token) {
    next({ name: "Unauthorized", message: "Invalid token" });
    return;
  }

  try {
    const data = verifyToken(token);
    const user = await User.findOne({
      include: {
        model: Role,
        as: "Roles",
        attribute: ["name"],
      },
      where: {
        id: data.id,
      },
    });
    if (!user) {
      next({ name: "Unauthorized", message: "Invalid token" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
