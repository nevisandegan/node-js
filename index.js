const express = require("express");
const app = express();
const AppError = require("./utils/app-error");
const globalErrorHandler = require("./controllers/errorController");
app.use(express.json());

const personRouter = require("./routes/personRoute");
const userRouter = require("./routes/userRoute");

//route
app.use("/api/v1/person", personRouter);
app.use("/api/v1/user", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`cant find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
