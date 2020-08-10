const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

module.exports = PurchaseDisputeNote = sequelize.define(
  "purchaseDisputeNote",
  {
    purDisNoteId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    purReqId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    note: {
      type: Sequelize.TEXT,
      allowNull: false,
    }
  },
  {
    timestamps: true,
  }
);