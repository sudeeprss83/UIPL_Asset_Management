const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

module.exports = ServiceRequest = sequelize.define(
  "serviceRequest",
  {
    serReqId: {
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
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    priority: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('Open','Closed'),
        allowNull: false,
    },
    isDeleted: {
        type: Sequelize.ENUM('0','1'),
        allowNull: false
    }
  },
  {
    timestamps: true,
  }
);
