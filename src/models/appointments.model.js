// Importar los DataTypes de Sequelize
const { DataTypes } = require("sequelize");
const db = require("../utils/database");
const Users = require("./users.model");
const Stocks = require("./stock.model");
const Cart = require("./cart.model");

// Definir el modelo Appointment
const Appointment = db.define("appointment", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
    },
    dateTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
        allowNull: false,
        defaultValue: "pending",
    },
    // Relación con el modelo User para el cliente que realizó la cita
    clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Users,
            key: "id",
        },
    },

    //Relacion con el modelo User para el barbero
    barberId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Users,
            key: "id",
        },
    },
    // Relación con el modelo Barber para el barbero asignado a la cita
    cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: "id",
        },
    },
});

module.exports = Appointment;
