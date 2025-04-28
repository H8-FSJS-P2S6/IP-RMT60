const errorHandler = (err, req, res, next) => {
  console.log(err);
  
  let statusCode = 500;
  let message = "Internal Server Error";

  switch (err.name) {
    case "SequelizeValidationError":
      statusCode = 400;
      message = err.errors.map(e => e.message).join(", ");
      break;
    case "SequelizeUniqueConstraintError":
      statusCode = 400;
      message = err.errors.map(e => e.message).join(", ");
      break;
    case "BadRequest":
      statusCode = 400;
      message = err.message;
      break;
    case "Unauthorized":
      statusCode = 401;
      message = err.message;
      break;
    case "Forbidden":
      statusCode = 403;
      message = err.message;
      break;
    case "NotFound":
      statusCode = 404;
      message = err.message;
      break;
    case "JsonWebTokenError":
      statusCode = 401;
      message = "Invalid token";
      break;
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;