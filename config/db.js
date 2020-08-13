//@sudip saha roy 

const { Sequelize } = require("sequelize");
require("dotenv").config();

module.exports = sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("database connection established");
  })
  .catch((err) => {
    console.log("error occured in database connection");
  });
