const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

module.exports = Token = sequelize.define(
  "refresh_token",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kind: {
      type: Sequelize.STRING,
    },
    refreshToken: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    isExpire: {
      type: Sequelize.STRING,
      defaultValue: 1,
    },
  },
  {
    timestamps: true,
  }
);
