const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();

const db = require("./config/db");

const adminRouter = require("./routes/users");
const dashboardRouter = require("./routes/dashboard");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/dashboard", dashboardRouter);
app.use("/admin", adminRouter);

module.exports = app;
