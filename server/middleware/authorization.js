function guardAdmin(req, res, next) {
  if (
    Array.isArray(req.user.Roles) &&
    req.user.Roles.some((el) => el.name === "admin")
  ) {
    return next();
  }
  console.log("~ guardAdmin ~ req:", req.user);
  next({ name: "Forbidden", message: "You are not authorized" });
  return;
}

function guardSeller(req, res, next) {
  if (
    Array.isArray(req.user.Roles) &&
    req.user.Roles.some((el) => el.name === "seller")
  ) {
    return next();
  }
  console.log("~ guardSeller ~ req:", req.user);
  next({ name: "Forbidden", message: "You are not authorized" });
  return;
}

module.exports = {
  guardAdmin,
  guardSeller,
};
