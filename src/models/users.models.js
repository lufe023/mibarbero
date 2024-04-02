const db = require("../utils/database");

const { DataTypes } = require("sequelize");
const Roles = require("./roles.models");

const Users = db.define("users", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "first_name",
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "last_name",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING, // +52
    allowNull: false,
    unique: true,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active",
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    field: "is_verified",
    defaultValue: false,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    references: {
      key: "id",
      model: Roles,
    },
  },
});

module.exports = Users;
