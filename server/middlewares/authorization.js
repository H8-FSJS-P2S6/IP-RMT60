const adminAuthorization = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      throw { name: "Forbidden", message: "You are not authorized" };
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { adminAuthorization };
