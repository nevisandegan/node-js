const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/signup", authController.singup);
router.post("/login", authController.login);

router.get("/getUsers", authController.getUsers);

router.post("/forget-password", authController.forgetPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);
router.patch("/updateMe", authController.protect, authController.updateMe);
router.delete("/deleteMe", authController.protect, authController.deleteMe);

module.exports = router;
