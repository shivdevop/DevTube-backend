import {Router} from "express"
import { getLikes, toggleLike } from "../controllers/like.controller.js"
import { verifyUser } from "../middlewares/auth.middleware.js"

const router=Router()

//toggle like for video, comment or post 
router.route("/toggle-like").post(verifyUser,toggleLike)

//get likes for a video, comment or post 
router.route("/video/:id").get(getLikes)
router.route("/comment/:id").get(getLikes)
router.route("/post/:id").get(getLikes)

export default router 