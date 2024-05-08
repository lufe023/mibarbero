//? Dependencies
const uuid = require("uuid");
const Playlist = require("../models/playlist.model");
const axios = require("axios");
const { Op } = require("sequelize");
require("dotenv").config();

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
        const listByUser = await Playlist.findAndCountAll({
            where: {
                userId,
            },
        });

        const promises = listByUser.rows.map(async (list) => ({
            id: list.id,
            userId,
            name: list.name,
            createdAt: list.createdAt,
            videos: await dataFromYoutube(list), // Esperar la resolución de dataFromYoutube()
        }));

        const results = await Promise.all(promises);

        return results;
    } catch (error) {
        console.error("Error al obtener la playlist:", error);
        throw error;
    }
};

const dataFromYoutube = async (playlist) => {
    const videoIds = playlist.videoIds.map((video) => video.videoId);

    try {
        const response = await axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
                params: {
                    part: "snippet",
                    id: videoIds.join(","),
                    key: process.env.YOUTUBE_API,
                },
            }
        );

        const videosData = response.data.items.map((item) => ({
            videoId: item.id,
            playing: playlist.videoIds.find(
                (video) => video.videoId === item.id && video.playing
            )
                ? true
                : false,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url,
            publishedAt: item.snippet.publishedAt,
            channelTitle: item.snippet.channelTitle,
            channelId: item.snippet.channelId,
            tags: item.snippet.tags,
        }));

        // Devuelve solo los items relevantes
        return videosData;
    } catch (error) {
        console.error("Error al obtener los datos de YouTube:", error);
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

        // Obtener la fecha y hora actual
        const currentDate = new Date();

        // Reconstruir la lista de videoIds con los cambios aplicados
        const updatedVideoIds = playlist.videoIds.map((video) => ({
            ...video,
            playing: video.videoId === videoId,
        }));

        // Actualizar la lista de videoIds en la playlist
        playlist.videoIds = updatedVideoIds;

        // Actualizar la fecha y hora de la última reproducción
        playlist.lastPlay = currentDate;

        // Guardar los cambios en la base de datos
        await playlist.save();

        const youtubeData = await streaminPLayList(playlist.userId);

        const data = {
            youtubeData,
            playlist,
        };
        return data;
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

        const youtubeData = await streaminPLayList(playlist.userId);

        const data = {
            youtubeData,
            playlist: playlist,
        };

        return data;
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

        const youtubeData = await streaminPLayList(playlist.userId);

        const data = {
            youtubeData,
            playlist: Playlist.findByPk(playlistId),
        };

        // Devolvemos la playlist actualizada
        return await data;
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
        const playlist = await Playlist.findOne({
            where: {
                userId,
                lastPlay: { [Op.ne]: null }, // Excluimos playlists con lastPlay igual a null
            },
            order: [["lastPlay", "DESC"]],
        });

        if (!playlist) {
            throw new Error("No se encontró ninguna playlist para el usuario");
        }

        // Obtener los videoIds de la playlist
        const videoIds = playlist.videoIds.map((video) => video.videoId);

        // Encontrar el video actualmente reproduciéndose, o el primer video si no hay ninguno marcado como reproduciéndose
        const playing = playlist.videoIds.find(
            (video) => video.playing == true
        );
        const selectedVideo = playing || playlist.videoIds[0];

        // Llamar a la API de YouTube para obtener la información de los videos
        const response = await axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
                params: {
                    part: "snippet", // Parte de la respuesta que deseamos
                    id: videoIds.join(","), // Convertimos los videoIds en una cadena separada por comas
                    key: process.env.YOUTUBE_API,
                },
            }
        );

        const videosData = response.data.items.map((item) => ({
            videoId: item.id,
            playing: selectedVideo && selectedVideo.videoId == item.id, // Verificar si este es el video que se está reproduciendo
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.default.url,
            publishedAt: item.snippet.publishedAt,
            channelTitle: item.snippet.channelTitle,
            channelId: item.snippet.channelId,
            tags: item.snippet.tags,
        }));

        videosData.find((video) => video.playing === true);

        const sugerencias = await getYouTubeSuggestions(
            (await videosData.find((video) => video.playing === true).tags)
                ? await videosData.find((video) => video.playing === true).tags
                : [
                      videosData.find((video) => video.playing === true)
                          .channelTitle,
                  ]
        );

        const playlistWithVideos = {
            ...playlist.toJSON(),
            videos: videosData,
            sugerencias,
        };

        return playlistWithVideos;
    } catch (error) {
        console.error("Error al obtener la playlist:", error);
        throw error;
    }
};

const deletePlaylist = async (playlistId) => {
    try {
        // Buscamos la playlist por su ID
        const playlist = await Playlist.findByPk(playlistId);

        // Verificamos si se encontró la playlist
        if (!playlist) {
            throw new Error("Playlist no encontrada");
        }

        // Eliminamos la playlist de la base de datos
        await playlist.destroy();

        return "Playlist eliminada exitosamente";
    } catch (error) {
        console.error("Error al eliminar la playlist:", error);
        throw error;
    }
};

// Controlador para obtener sugerencias de YouTube
const getYouTubeSuggestions = async (busqueda) => {
    try {
        if (busqueda) {
            const response = await axios.get(
                "https://www.googleapis.com/youtube/v3/search",
                {
                    params: {
                        q: busqueda.join(","),
                        part: "snippet",
                        maxResults: 11,
                        type: "video", // Solo videos
                        key: process.env.YOUTUBE_API,
                    },
                }
            );
            const relatedVideos = response.data.items;
            return relatedVideos;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error al buscar videos relacionados:", error);
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
    deletePlaylist,
};
