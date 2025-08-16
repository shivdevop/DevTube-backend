import {Router} from "express"
import { changeUserPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js"
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
router.route("/refresh-access-token").put(refreshAccessToken)
router.route("/change-password").post(verifyUser,changeUserPassword)
router.route("/current-user").get(verifyUser,getCurrentUser)
router.route("/update-account-details").put(verifyUser,updateAccountDetails)
router.route("/update-avatar").put(
    verifyUser,
    upload.single("avatar"),
    updateUserAvatar
)
router.route("/get-user-channel/:username").get(verifyUser,getUserChannelProfile)
router.route("/get-watch-history").get(verifyUser,getWatchHistory)

export default router