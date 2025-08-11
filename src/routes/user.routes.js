import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { loginUser } from "../controllers/user.controller.js"
import { verifyUser } from "../middlewares/auth.middleware.js"
import { logoutUser } from "../controllers/user.controller.js"
import { refreshAccessToken } from "../controllers/user.controller.js"

const router =Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured route
//we will user verifyUser middleware to protect this route


router.route("/logout").post(verifyUser,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)


export default router 