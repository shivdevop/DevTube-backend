import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getSingleVideo, updateVideo, uploadVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router=Router()

router.route("/upload-video").post(verifyUser,upload.fields([
    {
        name:"videoFile",
        maxCount:1
    },{
        name:"thumbnail",
        maxCount:1
    }
]),uploadVideo)

router.route("/").get(getAllVideos)
router.route("/:id").get(getSingleVideo)

router.route("/:id").patch(verifyUser,updateVideo)

router.route("/:id").delete(verifyUser,deleteVideo)

export default router