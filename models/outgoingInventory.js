const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

module.exports = OutgoingInventory = sequelize.define(
  "outgoingInventory",
  {
    outInvId: {
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
    },
    adminId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
  },
  {
    timestamps: true,
  }
);