const router = require("express").Router();
const passport = require("passport");
const playlistService = require("./playlist.services");
require("../middlewares/auth.middleware")(passport);

router
    .route("/")
    .get(
        passport.authenticate("jwt", { session: false }),
        playlistService.getMyPlaylistService
    )
    .post(
        passport.authenticate("jwt", { session: false }),
        playlistService.createPlayListService
    );

router.get(
    "/streaming/:userId",
    passport.authenticate("jwt", { session: false }),
    playlistService.streaminPLayListService
);

router.put(
    "/playingnow",
    passport.authenticate("jwt", { session: false }),
    playlistService.playingNowServices
);

router.put(
    "/changeName",
    passport.authenticate("jwt", { session: false }),
    playlistService.changePlaylistNameServices
);

router.put(
    "/neworder",
    passport.authenticate("jwt", { session: false }),
    playlistService.updateOrderServices
);

router.delete(
    "/deletevideo/:playListId/:videoId",
    passport.authenticate("jwt", { session: false }),
    playlistService.deleteItemServices
);

//playListId
router.delete(
    "/deletelist/:playListId",
    passport.authenticate("jwt", { session: false }),
    playlistService.deletePlayListServices
);

router.post(
    "/addvideo",
    passport.authenticate("jwt", { session: false }),
    playlistService.addVideoToListService
);

module.exports = router;
