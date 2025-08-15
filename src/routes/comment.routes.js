import {Router} from "express";
import { createComment, deleteComment, getComments, getReplies } from "../controllers/comment.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const router = Router()

// Create a comment (authenticated)
router.post("/post", verifyUser, createComment);

// Delete a comment (authenticated)
router.delete("/delete/:commentid", verifyUser, deleteComment);

// Get comments for a video, post, or comment (public, via query params)
// Example: GET /comments?targetType=Video&targetId=123
router.get("/", getComments);

// Get replies for a comment (public)
router.get("/replies/:commentId", getReplies);

export default router; 