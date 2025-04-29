function errorHandler(err, req, res, next) {
  console.error("Error:", err);

  let statusCode = 500;
  let message = "Internal server error";

  switch (err.name) {
    case "SequelizeValidationError":
      statusCode = 400;
      message = err.errors.map(e => e.message).join(", ");
      break;
    case "SequelizeUniqueConstraintError":
      statusCode = 400;
      message = "Data already exists";
      break;
    case "BadRequest":
      statusCode = 400;
      message = err.message || "Bad request";
      break;
    case "Unauthorized":
      statusCode = 401;
      message = err.message || "Authentication required";
      break;
    case "Forbidden":
      statusCode = 403;
      message = err.message || "Access forbidden";
      break;
    case "NotFound":
      statusCode = 404;
      message = err.message || "Resource not found";
      break;
    default:
      // Use default values
      break;
  }

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;