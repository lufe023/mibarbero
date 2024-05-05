const playlistController = require("./playlist.controllers");

//funcion servicio para llamar el controlador para crear o actualizar una play list
const createPlayListService = (req, res) => {
    const { userId, videoIds, name } = req.body;

    if ((userId, videoIds)) {
        playlistController
            .createPlaylist({ userId, name, videoIds })
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(400).json({ message: err });
            });
    } else {
        res.status(400).json({
            message: "Missing Data, all field must be completed",
            fields: {
                userId: "type=UUID",
                videoIds: "type=Array wit youtbe id's videos",
            },
        });
    }
};

//funcion servicio para llamar la play list de un usuario por id
const getMyPlaylistService = (req, res) => {
    const userId = req.user.id;
    playlistController
        .getPlaylistByUser(userId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

//playing now - funcion para seleccionar que esta sonando
const playingNowServices = (req, res) => {
    const playListId = req.body.playListId;
    const videoId = req.body.videoId;

    playlistController
        .playingNow(playListId, videoId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

const updateOrderServices = (req, res) => {
    const playListId = req.body.playListId;
    const video = req.body.video;
    const newPosition = req.body.newPosition;

    playlistController
        .updateOrder(video, newPosition, playListId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

const changePlaylistNameServices = (req, res) => {
    const playListId = req.body.playListId;
    const newName = req.body.newName;

    playlistController
        .changePlaylistName(playListId, newName)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

//eliminar un video de la lista
const deleteItemServices = (req, res) => {
    const { playListId, videoId } = req.params;

    playlistController
        .deleteItem(playListId, videoId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

//eliminar un video de la lista
const deletePlayListServices = (req, res) => {
    const { playListId } = req.params;

    playlistController
        .deletePlaylist(playListId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

const addVideoToListService = (req, res) => {
    const playListId = req.body.playListId;
    const videoId = req.body.videoId;

    playlistController
        .addVideoToList(playListId, videoId)
        .then((data) => {
            if (data.code === 0) {
                res.status(400).json({
                    err: "El video ya existe en la lista del playlist",
                });
            } else {
                res.status(200).json(data);
            }
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

const streaminPLayListService = (req, res) => {
    const { userId } = req.params;

    playlistController
        .streaminPLayList(userId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(400).json({ err });
        });
};

module.exports = {
    createPlayListService,
    getMyPlaylistService,
    playingNowServices,
    updateOrderServices,
    changePlaylistNameServices,
    deleteItemServices,
    addVideoToListService,
    streaminPLayListService,
    deletePlayListServices,
};
