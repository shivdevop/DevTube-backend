import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";
const router=Router()

router.route("/").get(verifyUser,getDashboard)

export default router