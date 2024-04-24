//? Dependencies
const uuid = require("uuid");
const Playlist = require("../models/playlist.model");

//creando una nueva lista
const createPlaylist = async (data) => {
    try {
        const playlist = await Playlist.create({
            // Valores predeterminados para crear una nueva lista de reproducción si no existe
            id: uuid.v4(), // Genera un nuevo UUID para la nueva lista de reproducción
            userId: data.userId, // Asigna el ID del usuario que crea la lista de reproducción
            name: data.name || "Untitle",
            videoIds: data.videoIds, // Asigna los IDs de los vídeos de la lista de reproducción
        });

        return playlist;
    } catch (error) {
        console.error(
            "Error al crear o actualizar la lista de reproducción:",
            error
        );
        throw error;
    }
};

//actualizando el nombre de una lista existente
const changePlaylistName = async (playlistId, newName) => {
    try {
        // Buscamos la playlist por su ID
        const playlist = await Playlist.findByPk(playlistId);

        // Verificamos si se encontró la playlist
        if (!playlist) {
            throw new Error("Playlist no encontrada");
        }

        // Actualizamos el campo 'name' de la playlist
        playlist.name = newName;

        // Guardamos los cambios en la base de datos
        await playlist.save();

        return playlist;
    } catch (error) {
        console.error("Error al cambiar el nombre de la playlist:", error);
        throw error;
    }
};

//obteniendo las playList de un usuario
const getPlaylistByUser = async (userId) => {
    try {
        const listByUser = Playlist.findAndCountAll({
            where: {
                userId,
            },
        });
        return listByUser;
    } catch (error) {
        console.error("Error al obtener la playlist:", error);
        throw error;
    }
};

//esta funcion establece que se esta reproduciendo
const playingNow = async (id, videoId) => {
    try {
        // Buscar la playlist del usuario
        const playlist = await Playlist.findByPk(id);

        // Verificar si se encontró la playlist
        if (!playlist) {
            throw new Error("Playlist no encontrada");
        }

        // Reconstruir la lista de videoIds con los cambios aplicados
        const updatedVideoIds = playlist.videoIds.map((video) => ({
            ...video,
            playing: video.videoId === videoId,
        }));

        // Actualizar la lista de videoIds en la playlist
        playlist.videoIds = updatedVideoIds;

        // Guardar los cambios en la base de datos
        await playlist.save();

        return playlist;
    } catch (error) {
        console.error("Error al actualizar el estado de reproducción:", error);
        throw error;
    }
};

//esta funcion cambia el orden de reproduccion recive un objeto video
// "video":{ "playing":false, "videoId": "iVhpBojnxC0"},
//"newPosition":0 //si este video aparece entonces lo pondra en la primera position del array
//playListId es casi obvio lo que es, no? pues el el id de la play list :) im so crazy
const updateOrder = async (video, newPosition, playListId) => {
    try {
        // Buscamos la playlist por su ID
        const playList = await Playlist.findByPk(playListId);

        // Verificamos si se encontró la playlist
        if (!playList) {
            throw new Error("Playlist no encontrada");
        }

        // Encontramos el índice del video en la lista actual
        const index = playList.videoIds.findIndex(
            (item) => item.videoId === video.videoId
        );

        // Si el video no está en la lista actual, lanzamos un error
        if (index === -1) {
            throw new Error("El video no está en la lista de reproducción");
        }

        // Sacamos el video de su posición actual
        const removedVideo = playList.videoIds.splice(index, 1)[0];

        // Insertamos el video en la nueva posición
        playList.videoIds.splice(newPosition, 0, removedVideo);

        // Convertimos la lista de videoIds a un formato adecuado para almacenar en la base de datos
        const updatedVideoIds = playList.videoIds.map((item) => ({
            videoId: item.videoId,
            playing: item.playing,
        }));

        // Actualizamos la columna 'videoIds' en la base de datos
        await Playlist.update(
            { videoIds: updatedVideoIds },
            { where: { id: playListId } }
        );

        return await Playlist.findByPk(playListId); // Devolvemos la playlist actualizada
    } catch (error) {
        console.error("Error al actualizar el orden de reproducción:", error);
        throw error;
    }
};

//funcion para eliminar una cancion de la lista
const deleteItem = async (playlistId, videoId) => {
    try {
        // Buscamos la playlist por su ID
        const playlist = await Playlist.findByPk(playlistId);

        // Verificamos si se encontró la playlist
        if (!playlist) {
            throw new Error("Playlist no encontrada");
        }

        // Filtramos el elemento que se desea eliminar
        playlist.videoIds = playlist.videoIds.filter(
            (video) => video.videoId !== videoId
        );

        // Guardamos los cambios en la base de datos
        await playlist.save();

        return playlist;
    } catch (error) {
        console.error("Error al eliminar el elemento del playlist:", error);
        throw error;
    }
};

const addVideoToList = async (playlistId, newVideoId) => {
    try {
        // Buscamos la playlist por su ID
        const playlist = await Playlist.findByPk(playlistId);

        // Verificamos si se encontró la playlist
        if (!playlist) {
            throw new Error("Playlist no encontrada");
        }

        // Verificamos si el video ya existe en la lista
        const existingVideoIndex = playlist.videoIds.findIndex(
            (video) => video.videoId === newVideoId
        );

        if (existingVideoIndex !== -1) {
            new Error("El video ya existe en la lista del playlist");
            const fail = {
                code: 0,
                error: "El video ya existe en la lista del playlist",
            };
            return fail;
            //throw new Error("El video ya existe en la lista del playlist");
        }

        // Creamos una nueva lista de videos con el nuevo video agregado
        const updatedVideoIds = [
            ...playlist.videoIds,
            { videoId: newVideoId, playing: false },
        ];

        // Actualizamos la lista de videos en la base de datos
        await Playlist.update(
            { videoIds: updatedVideoIds },
            { where: { id: playlistId } }
        );

        // Devolvemos la playlist actualizada
        return await Playlist.findByPk(playlistId);
    } catch (error) {
        console.error(
            "Error al añadir un video a la lista del playlist:",
            error
        );
        throw error;
    }
};

const streaminPLayList = async (userId) => {
    try {
        const listsByUser = await Playlist.findAll({
            where: {
                userId,
            },
            order: [["updatedAt", "DESC"]], // Ordenar por updatedAt en orden descendente
        });

        // Devolver solo la primera lista de reproducción (la más reciente)
        return listsByUser[0];
    } catch (error) {
        console.error("Error al obtener la playlist:", error);
        throw error;
    }
};

module.exports = {
    createPlaylist,
    getPlaylistByUser,
    updateOrder,
    playingNow,
    changePlaylistName,
    deleteItem,
    addVideoToList,
    streaminPLayList,
};
