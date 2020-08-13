//@sudip saha roy 

const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

module.exports = Role = sequelize.define(
  "role",
  {
    roleId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    role: {
      type: Sequelize.STRING,
    },
  },
  {
    timestamps: false,
  }
);
