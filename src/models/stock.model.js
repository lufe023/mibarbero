// Importar los DataTypes de Sequelize
const { DataTypes } = require("sequelize");
const db = require("../utils/database");

// Definir el modelo stock
const Stocks = db.define("stock", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM("service", "product"),
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
});

// Exportar el modelo de Stock
module.exports = Stocks;
