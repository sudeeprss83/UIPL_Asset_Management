const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

module.exports = IncomingInventory = sequelize.define(
  "incomingInventory",
  {
    incInvId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    assetId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    modelId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  },
  {
    timestamps: true,
  }
);