import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


//we will expect user to send id of video, comment or post to like/unlike 
export const toggleLike=asyncHandler(async(req,res)=>{

    const {targetId,targetType}=req.body 
    console.log(targetId)

    if (!["video","comment","post"].includes(targetType)){
        throw new ApiError(400,"invalid target type")
    }

    const filter={
        likedBy:req.user._id
    }
    filter[targetType]=targetId
    //{ likedBy: userId, video: targetId }
    console.log(filter)

    const existingLike=await Like.findOne(filter)

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(
            new ApiResponse(200,"like removed ")
        )
    }

    //create new like if existing like not present 
    const newLike=await Like.create(filter)

    return res.status(201).json(
        new ApiResponse(201,newLike,"Like created successfully")
    )

})

//get likes for a resource 
export const getLikes=asyncHandler(async(req,res)=>{
    const {videoid,commentid,postid}=req.params
    const filter={}

    if (videoid) filter.video=videoid
    if (commentid) filter.comment=commentid 
    if (postid) filter.post=postid 

    const likes=await Like.find(filter).populate("likedBy","username avatar")
    return res.status(200).json(
        new ApiResponse(200,likes,"likes fetched successfully")
    )
})
