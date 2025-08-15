import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


//subscribe to a channel(which will be a ref to another user id basically)
export const subscribe=asyncHandler(async(req,res)=>{
    const {channelid}=req.params
    const userid=req.user._id
    if (userid.toString()===channelid.toString()){
        throw new ApiError(400,"you cannot subscribe to yourself")
    }
    const subscription=await Subscription.create({
        subscriber:userid,
        channel:channelid
    })

    return res.status(201).json(
        new ApiResponse(201,subscription,"subscribed successfully")
    )

})


//unsubscribe from a channel 
export const unsubscribe=asyncHandler(async(req,res)=>{
    const {channelid}=req.params
    const userid=req.user._id

    if (userid.toString()===channelid.toString()){
        throw new ApiError(400,"you cannot unsubscribe to yourself")
    }
    const result=await Subscription.findOneAndDelete({
        subscriber:userid,
        channel:channelid
    })
    if (!result){
        throw new ApiError(400,"You are not subscribed to this channel")
    }

    return res.status(200).json(
        new ApiResponse(200,result,"unsubscribed successfully")
    )
})


//get subscriber count for a channel 
//we can count how many documents are present with the channel id 
export const getSubscriberCount=asyncHandler(async(req,res)=>{
    //getting the channel id
    const {channelid}=req.params 

    const count=await Subscription.countDocuments({
        channel:channelid
    })

    return res.status(200).json(
        new ApiResponse(200,{count},"subscriber count fetched successfully")
    )
})


//show list of channels you have subscribed to 
export const getSubscriptions=asyncHandler(async(req,res)=>{
    const userid=req.user._id 
    
    const subscriptions=await Subscription.find({subscriber:userid}).populate("channel","username avatar")
    return res.status(200).json(
        new ApiResponse(200,subscriptions,"subscriptions fetched successfully")
    )

})

