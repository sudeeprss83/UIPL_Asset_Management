const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

module.exports = Validation = sequelize.define(
  "validation",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: Sequelize.STRING,
    },
    country_code: {
      type: Sequelize.STRING,
    },
    uid: {
      type: Sequelize.INTEGER,
    },
    otp: {
      type: Sequelize.TEXT,
    },
    role: {
      type: Sequelize.INTEGER,
    },
    validation_type: {
      type: Sequelize.STRING,
      defaultValue: "email",
    },
    validation_hash: {
      type: Sequelize.TEXT,
    },
    validation_meta: {
      type: Sequelize.INTEGER,
    },
    ref_email: {
      type: Sequelize.STRING,
    },
    ref_id: {
      type: Sequelize.STRING,
    },
    is_expired: {
      type: Sequelize.INTEGER,
    },
    is_verified: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: true,
  }
);
