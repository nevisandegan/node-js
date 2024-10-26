const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const { promisify } = require("util");

exports.singup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("please fill password or email", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  const correct = user.correctPassword(password, user.password);
  if (!user || !correct) {
    return next(new AppError("password or email invalid", 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    token,
  });
});

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "login kon bad darkhast bezan alakli sedam nazan irad az fronte",
        401
      )
    );
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decode.id);

  if (!freshUser) {
    new AppError("user mored nazar nist", 401);
  }

  if (freshUser.changedPasswordAfter(decode.iat)) {
    new AppError("ramz avaz shode", 401);
  }

  req.user = freshUser;
  next();
};

exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new AppError("there is no permission", 403));
    }
    next();
  };
};