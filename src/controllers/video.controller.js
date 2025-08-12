import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

//upload a video
//we have to use auth middleware before using uploadvideo endpoint in our router !!
export const uploadVideo=asyncHandler(async (req,res)=>{
    const {title,description,duration}=req.body
    if (!title || !description || !duration || !req.files?.videoFile?.[0] || !req.files?.thumbnail?.[0]) {
        throw new ApiError(400, "All fields and files are required");
    }

    const videoFilePath=req.files?.videoFile?.[0]?.path
    const thumbnailPath=req.files?.thumbnail?.[0]?.path

    if(!videoFilePath || !thumbnailPath){
        throw new ApiError(400,"files didn't upload locally")
    }

    const videoUpload=await uploadOnCloudinary(videoFilePath)
    const thumbnailUpload=await uploadOnCloudinary(thumbnailPath)

    if (!videoUpload || !thumbnailUpload){
        throw new ApiError(400,"files didn't upload to cloudinary")
    }

    const newVideo= await Video.create({
        title,
        description,
        duration,
        videoFile:videoUpload.url,
         videoFilePublicId: videoUpload.public_id,
        thumbnail:thumbnailUpload.url,
        thumbnailPublicId: thumbnailUpload.public_id,
        owner:req.user._id
    })

    return res.status(201).json(
        new ApiResponse(201, newVideo, "video upload successful")
    )
})


//Get all the videos (paginated)
export const getAllVideos=asyncHandler(async(req,res)=>{

    const {page=1,limit=10}=req.query
    const aggregate=Video.aggregate([
        {
            $match:{
                isPublished:true
            }
        },
        {
            $sort:{
                createdAt:-1  //descending order, so pull the latest created videos
            }
        }
    ])

    const options={page:Number(page),limit:Number(limit)}
    const videos= await Video.aggregatePaginate(aggregate,options)

    return res.status(200).json(
        new ApiResponse(200,videos.docs,"videos fetched successfully")
    )

})


//get a single video and update its views
export const getSingleVideo=asyncHandler(async(req,res)=>{
    const {id}=req.params
     
    const video=await Video.findById(id).populate("owner","username avatar")
    if (!video){
        throw new ApiError(404,"VIDEO NOT FOUND")
    }
    video.views+=1
    await video.save()
    
    return res.status(200).json(
        new ApiResponse(200,video,"video fetched successfully")
    )
})

//update details of a video, logged in user only 
export const updateVideo=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const video=await Video.findById(id)
    if (!video){
        throw new ApiError(404,"video not found")
    }
    //we will check if the person is authorized to update the vide
    //whether the person is author of video or not 
    if (video.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"not authorized to update the video")
    }

    const {title,description,duration,isPublished}=req.body
    if (!title && !description && !duration && isPublished===undefined){
        throw new ApiError(400,"nothing to update")
    }
    //update the video
    if(title) video.title=title
    if (description) video.description=description 
    if (duration) video.duration=duration 
    if (isPublished !== undefined) video.isPublished=isPublished 

    await video.save()

    return res.status(200).json(new ApiResponse(200,video, "video updated successfully"))

})

//delete a video, logged in user only !!!
export const deleteVideo=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const video=await Video.findById(id)
    if (!video){
        throw new ApiError(404,"video not found")
    }

    if (video.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"Not authorized to delete the video")
    }

    //delete the video and thumbnail from cloudinary
    if (video.videoFilePublicId) await deleteFromCloudinary(video.videoFilePublicId,"video");
    if (video.thumbnailPublicId) await deleteFromCloudinary(video.thumbnailPublicId,"image");

    await video.deleteOne()
    return res.status(200).json(new ApiResponse(200,"video deleted successfully"))
})

