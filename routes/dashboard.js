const express = require("express");
const dashboardRouter = express.Router();

const dashboardController = require("../controllers/dashboardController");
const middleware = require("../middlewares/routeValidator");

/* GET dashboard page. */
dashboardRouter.get("/", middleware.verifyUser, dashboardController.dashboard);

dashboardRouter.post(
  "/create-admin",
  middleware.verifyUser,
  dashboardController.addAdminOrSubAdmin
);

dashboardRouter.get(
  "/admins",
  middleware.verifyUser,
  dashboardController.allAdminsOrSubAdmins
);

dashboardRouter.get(
  "/admin/:id",
  middleware.verifyUser,
  dashboardController.specificAdminOrSubAdmin
);

dashboardRouter.post(
  "/block-admin/:id",
  middleware.verifyUser,
  dashboardController.blockAdminOrSubAdmin
);

dashboardRouter.post(
  "/unblock-admin/:id",
  middleware.verifyUser,
  dashboardController.unblockAdminOrSubAdmin
);

dashboardRouter.put(
  "/edit-admin",
  middleware.verifyUser,
  dashboardController.editAdmin
);

dashboardRouter.post(
  "/change-admin-password/:id",
  middleware.verifyUser,
  dashboardController.changeAdminOrSubAdminPassword
);

dashboardRouter.post(
  "/create-role",
  middleware.verifyUser,
  dashboardController.createRole
);

dashboardRouter.post(
  "/assign-role",
  middleware.verifyUser,
  dashboardController.assignRole
);

dashboardRouter.post(
  "/update-password",
  middleware.verifyUser,
  dashboardController.userUpdatePassword
);

module.exports = dashboardRouter;
