const express = require("express");
const dashboardRouter = express.Router();

const middleware = require("../middlewares/route_validator");

/* GET dashboard page. */
dashboardRouter.get("/", middleware.verifyUser, function (req, res, next) {
  res.send("this is your dashboard");
});

module.exports = dashboardRouter;
