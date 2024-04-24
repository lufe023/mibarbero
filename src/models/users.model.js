const db = require("../utils/database");

const { DataTypes } = require("sequelize");
const Roles = require("./roles.model");

const Users = db.define("users", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "first_name",
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
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
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING, // +52
        allowNull: false,
        unique: true,
    },

    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Roles,
            key: "id",
        },
        defaultValue: 1,
    },
});

module.exports = Users;
