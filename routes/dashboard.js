const express = require("express");
const dashboardRouter = express.Router();

const dashboardController = require("../controllers/dashboardController");
const middleware = require("../middlewares/routeValidator");

/* GET dashboard page. */
dashboardRouter.get("/", middleware.verifyUser, dashboardController.dashboard);

// dashboardRouter.post(
//   "/create-admin",
//   middleware.verifyUser,
//   dashboardController.addAdminOrSubAdmin
// );

// dashboardRouter.get(
//   "/admins",
//   middleware.verifyUser,
//   dashboardController.allAdminsOrSubAdmins
// );

// dashboardRouter.get(
//   "/admin/:id",
//   middleware.verifyUser,
//   dashboardController.specificAdminOrSubAdmin
// );

// dashboardRouter.post(
//   "/block-admin/:id",
//   middleware.verifyUser,
//   dashboardController.blockAdminOrSubAdmin
// );

// dashboardRouter.post(
//   "/unblock-admin/:id",
//   middleware.verifyUser,
//   dashboardController.unblockAdminOrSubAdmin
// );

// dashboardRouter.post(
//   "/change-admin-password/:id",
//   middleware.verifyUser,
//   dashboardController.changeAdminOrSubAdminPassword
// );



// dashboardRouter.post(
//   "/update-password",
//   middleware.verifyUser,
//   dashboardController.userUpdatePassword
// );

//-------------------------------------as per epic mapping-----------------------//
dashboardRouter.get(
  "/view-admin",
  middleware.verifyUser,
  dashboardController.viewAdmin
);

dashboardRouter.put(
  "/edit-admin/:id",
  middleware.verifyUser,
  dashboardController.editAdmin
);

dashboardRouter.post(
  "/add-sub-admin",
  middleware.verifyUser,
  dashboardController.createSubAdmin
);

dashboardRouter.put(
  "/edit-sub-admin/:id",
  middleware.verifyUser,
  dashboardController.editSubAdmin
);

dashboardRouter.put(
  "/change-password-subadmin/:id",
  middleware.verifyUser,
  dashboardController.changeSubadminPassword
);

dashboardRouter.post(
  "/block-subadmin/:id",
  middleware.verifyUser,
  dashboardController.blockSubadmin
);

dashboardRouter.post(
  "/unblock-subadmin/:id",
  middleware.verifyUser,
  dashboardController.unblockSubadmin
);

dashboardRouter.post(
  "/create-role",
  middleware.verifyUser,
  dashboardController.createRole
);

dashboardRouter.post(
  "/edit-role",
  middleware.verifyUser,
  dashboardController.editRole
);

dashboardRouter.post(
  "/assign-role",
  middleware.verifyUser,
  dashboardController.assignRole
);

module.exports = dashboardRouter;
