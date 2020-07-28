const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/user_controller");
const routevalidate = require("../middlewares/route_validator");

userRouter.post("/login", userController.userLogin);

userRouter.post("/newaccessToken", userController.RegenerateAccessToken);

userRouter.post("/forgot-password", userController.userForgotPassword);

userRouter.post("/reset-password/:id", userController.userResetPassword);

userRouter.post(
  "/update-password",
  routevalidate.verifyUser,
  userController.userUpdatePassword
);

userRouter.post("/auto-logout", userController.userAutoLogout);

userRouter.post("/logout", routevalidate.verifyUser, userController.userLogout);

module.exports = userRouter;
