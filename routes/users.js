const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/userController");
const routevalidate = require("../middlewares/routeValidator");

userRouter.post("/login", userController.userLogin);

userRouter.post("/newaccessToken", userController.RegenerateAccessToken);

userRouter.post("/forgot-password", userController.userForgotPassword);

userRouter.post("/reset-password/:token", userController.userResetPassword);

userRouter.post(
  "/update-password",
  routevalidate.verifyUser,
  userController.userUpdatePassword
);

userRouter.post(
  "/auto-logout",
  routevalidate.verifyUser,
  userController.userAutoLogout
);

userRouter.post("/logout", routevalidate.verifyUser, userController.userLogout);

module.exports = userRouter;
