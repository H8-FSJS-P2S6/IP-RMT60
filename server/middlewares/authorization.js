function adminAuthorization(req, res, next) {
  try {
    if (req.user.role !== "Admin") {
      throw { name: "Forbidden", message: "Admin access required" };
    }
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { adminAuthorization };
