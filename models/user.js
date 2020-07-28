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
    phone: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    role: {
      type: Sequelize.TEXT,
      defaultValue:'Admin'
    },
    status: {
      type: Sequelize.TEXT,
      defaultValue:'Inactive'
    },
  },
  {
    timestamps: true,
  }
);
