import {Router} from "express"
import { getSubscriberCount, getSubscriptions, subscribe, unsubscribe } from "../controllers/subscription.controller.js"
import { verifyUser } from "../middlewares/auth.middleware.js"

const router=Router()

router.route("/:channelid").post(verifyUser,subscribe)
router.route("/:channelid").delete(verifyUser,unsubscribe)
router.route("/count/:channelid").get(getSubscriberCount)
router.route("/mySubscriptions").get(verifyUser,getSubscriptions)

export default router

