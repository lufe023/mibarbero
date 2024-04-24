// Importar los DataTypes de Sequelize
const { DataTypes } = require("sequelize");
const db = require("../utils/database");

// Definir el modelo stock
const Cart = db.define("carts", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

// Exportar el modelo de Stock
module.exports = Cart;
