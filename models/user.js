const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

module.exports = User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    roleId: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.TEXT,
      defaultValue: "Active",
    },
  },
  {
    timestamps: true,
  }
);
