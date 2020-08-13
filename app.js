//@sudip saha roy 

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

require("dotenv").config();
require("./config/db");

const adminRouter = require("./routes/users");
const dashboardRouter = require("./routes/dashboard");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/dashboard", dashboardRouter);
app.use("/admin/api", adminRouter);

module.exports = app;