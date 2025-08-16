import {Router} from "express"
import { verifyUser } from "../middlewares/auth.middleware.js"
import { createPlaylist,getUserPlaylists,getPlaylistById, addVideoToPlaylist,removeVideoFromPlaylist, updatePlaylist, deletePlaylist, togglePlaylistPrivacy } from "../controllers/playlist.controller.js"

const router=Router()

router.route("/newPlaylist").post(verifyUser, createPlaylist)
router.route("/userPlaylists/:userId").get(getUserPlaylists)
router.route("/:playlistId").get(verifyUser,getPlaylistById)
router.route("/:playlistId/addVideo/:videoId").post(verifyUser,addVideoToPlaylist)
router.route("/:playlistId/removeVideo/:videoId").delete(verifyUser,removeVideoFromPlaylist)
router.route("/update/:playlistId").patch(verifyUser,updatePlaylist)
router.route("/delete/:playlistId").delete(verifyUser,deletePlaylist)
router.route("/togglePrivacy/:playlistId").put(verifyUser,togglePlaylistPrivacy)

export default router

