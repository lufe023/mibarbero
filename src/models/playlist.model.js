const { DataTypes } = require("sequelize");
const db = require("../utils/database");
const Users = require("./users.model"); // Importa el modelo de Usuarios si aún no lo has hecho
const { types } = require("pg");

const Playlist = db.define("playlist", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    // Relación con el usuario que creó la lista de reproducción
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Users,
            key: "id",
        },
    },

    // Array de IDs de vídeos de YouTube en la lista de reproducción
    videoIds: {
        type: DataTypes.ARRAY(DataTypes.JSONB), // Utiliza JSONB para almacenar objetos JSON
        allowNull: true, // Puedes decidir si permites listas sin orden específico
    },
});

module.exports = Playlist;

//forma de uso
// videoIds: [
//     { position: 1, videoId: '89288', playing:false },   //Primer video en la lista
//     { position: 2, videoId: '49858', playing:false },, //Segundo video en la lista
//     { position: 3, videoId: '89288', playing:true },  //tercer video en la lista y tocando
//     { position: 4, videoId: '89288', playing:false },, //cuarto video en la lista
//     // Otros videos en otras listas, si existen
//   ]
