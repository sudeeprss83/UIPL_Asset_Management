const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

module.exports = Supplier = sequelize.define(
  "supplier",
  {
    supplierId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    supplierName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  },
  {
    timestamps: true,
  }
);