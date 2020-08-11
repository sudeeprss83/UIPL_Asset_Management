const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

module.exports = PurchaseRequest = sequelize.define(
  "purchaseRequest",
  {
    purReqId: {
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
    unitPrice: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    tax: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    bill: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    adminId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    supplierId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    status: {
        type: Sequelize.ENUM('0', '1', '2', '3', '4'),
        /*
         0 - Not Approved, 
         1 - Approved
         2 - Purchase Order Placed
         3 - Order Received
         4 - Dispute
        */
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