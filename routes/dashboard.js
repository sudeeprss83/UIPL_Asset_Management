const express = require("express");
const dashboardRouter = express.Router();

const dashboardController = require("../controllers/dashboardController");
const middleware = require("../middlewares/routeValidator");

/* GET dashboard page. */
dashboardRouter.get("/", middleware.verifyUser,dashboardController.dashboard);

dashboardRouter.post("/create-admin", middleware.verifyUser, dashboardController.createAdmin);

dashboardRouter.get("/admins", middleware.verifyUser,dashboardController.allAdmins);

dashboardRouter.get("/admin/:id", middleware.verifyUser,dashboardController.specificAdmin);

dashboardRouter.post("/block-admin/:id", middleware.verifyUser, dashboardController.blockAdmin);

dashboardRouter.put("/edit-admin", middleware.verifyUser,dashboardController.editAdmin);

dashboardRouter.put("/create-role", middleware.verifyUser,dashboardController.createRole);

dashboardRouter.put("/assign-role", middleware.verifyUser, dashboardController.assignRole);



module.exports = dashboardRouter;
