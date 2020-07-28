const express = require("express");
const dashboardRouter = require("./dashboard");
const indexRouter = express.Router();

/* GET home page. */
indexRouter.get("/", function (req, res, next) {
  res.send("hello world");
});

indexRouter.use("/dashboard", dashboardRouter);

module.exports = indexRouter;
