// Importar los DataTypes de Sequelize
const { DataTypes } = require("sequelize");
const db = require("../utils/database");
const Stock = require("./stock.model");
const Cart = require("./cart.model");

// Definir el modelo stock
const cartItem = db.define("cartitem", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cartId: {
        type: DataTypes.INTEGER,
        references: {
            model: Cart,
            key: "id",
        },
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // Relación con el Producto/Servicio
    serviceProductId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Stock,
            key: "id",
        },
        field: "service_product_id",
    },
});

// Exportar el modelo de Stock
module.exports = cartItem;
