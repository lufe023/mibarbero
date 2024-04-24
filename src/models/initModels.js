const Users = require("./users.model");
const Roles = require("./roles.model");
const Appointments = require("./appointments.model");
const Cart = require("./cart.model");
const CartItem = require("./cartItem.model");
const Stocks = require("./stock.model");
const Playlist = require("./playlist.model");

const initModels = () => {
    // INICIO de las relaciones de Appointments
    Appointments.belongsTo(Users, { foreignKey: "clientId", as: "client" });
    Appointments.belongsTo(Users, { foreignKey: "barberId", as: "barber" });
    // Relación con Cart en lugar de Stocks
    Appointments.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });
    // FIN de las relaciones de Appointments

    Cart.hasMany(CartItem, { foreignKey: "cartId" });
    CartItem.belongsTo(Cart, { foreignKey: "cartId" });

    CartItem.belongsTo(Stocks, { foreignKey: "serviceProductId" });
    Stocks.hasMany(CartItem, { foreignKey: "serviceProductId" });

    Users.hasMany(Playlist, { foreignKey: "userId" });
};

module.exports = initModels;
