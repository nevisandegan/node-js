const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/signup", authController.singup);
router.post("/login", authController.login);

router.post("/forget-password", authController.forgetPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

module.exports = router;
