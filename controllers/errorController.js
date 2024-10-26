const AppError = require("../utils/app-error");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.operational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went very wrong",
    });
  }
};

const handleValidationError = (err) => {
  const error = Object.values(err.errors).map((item) => item);

  const message = `Invalid input data.${error.join(".")}`;

  return new AppError(message, 400);
};

const handleMongoCast = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;

  return new AppError(message, 500);
};

const handleDublicateError = (err) => {
  const message = `Invalid dublicate data`;

  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  console.log("--------------------------------------err", err);
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err.name === "CastError") error = handleMongoCast(error);
    if (err.name === "ValidationError") error = handleValidationError(error);
    if (err.code === 11000) error = handleDublicateError(error);

    sendErrorProd(error, res);
  }
};
