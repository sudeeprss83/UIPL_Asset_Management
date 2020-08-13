const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/userController");
const middleware = require("../middlewares/routeValidator");

userRouter.post("/login", userController.userLogin);

userRouter.post("/forgot-password", userController.userForgotPassword);

userRouter.post("/reset-password/:token", userController.userResetPassword);

userRouter.post(
  "/auto-logout",
  middleware.verifyUser,
  userController.userAutoLogout
);

userRouter.post("/logout", middleware.verifyUser, userController.userLogout);

userRouter.post("/newaccessToken", userController.RegenerateAccessToken);

module.exports = userRouter;
