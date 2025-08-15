import {Router} from "express";
import { createPost, deletePost, getChannelPosts } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router();

// Create a post (with image upload)
router.post("/create", verifyUser, upload.single("image"), createPost);

// Delete a post
router.delete("/delete/:postid", verifyUser, deletePost);

// Get paginated posts for a channel (public)
router.get("/channel/:channelid", getChannelPosts);

export default router;

