import {Router} from "express"
import { getLikes, toggleLike } from "../controllers/like.controller.js"
import { verifyUser } from "../middlewares/auth.middleware.js"

const router=Router()

//toggle like for video, comment or post 
router.route("/toggle-like").post(verifyUser,toggleLike)

//get likes for a video, comment or post 
router.route("/video/:videoid").get(getLikes)
router.route("/comment/:commentid").get(getLikes)
router.route("/post/:postid").get(getLikes)

export default router 