import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


//create a post 
export const createPost=asyncHandler(async(req,res)=>{
    const {title,content}=req.body
    if(!title || !content){
        throw new ApiError(400,"title and content are required")
    }

    let imageLocalPath=null
    let imageUrl=null
    if(req.file){
        imageLocalPath=req.file?.path
        const cloudinaryResponse=await uploadOnCloudinary(imageLocalPath)
        if (!cloudinaryResponse){
            throw new ApiError(400,"image upload failed")
        }
        imageUrl=cloudinaryResponse.url
    }

    const post=await Post.create({
        title,
        content,
        owner:req.user._id,
        image:imageUrl
    })

    if (!post){
        throw new ApiError(400,"POST CREATION FAILED",post)
    }

    return res.status(201).json(
        new ApiResponse(201,post,"post created successfully")
    )

})

export const deletePost=asyncHandler(async(req,res)=>{
    const {postid}=req.params
    const userid=req.user._id
    
    //first find the post, if we find the post then we check whether the person is authorized to delete the post
    const post=await Post.findById(postid)
    if (!post){
        throw new ApiError(400,"POST NOT FOUND")
    }

    if(userid.toString()!==post.owner.toString()){
        throw new ApiError(400,"unauthorized access")
    }

    //if authorized delete the post
    const result=await Post.findByIdAndDelete(postid)
    if (!result){
        throw new ApiError(400,"post not deleted")
    }

    return res.status(200).json(
        new ApiResponse(200,"post deleted successfully")
    ) 
    
})

//fetch all posts for a channel [paginated]
//user doesn't need to be logged in to view the posts of a channel 
export const getChannelPosts=asyncHandler(async(req,res)=>{
    const {channelid}=req.params
    const {page=1,limit=10}=req.query

    const channelexists=await User.findById(channelid)
    if(!channelexists){
        throw new ApiError(400,"channel not found")
    }

    //let's build aggregation pipleine 
    const aggregate=await Post.aggregate([
        {
            $match:{
                owner:channelid
            }
        },{
            $sort:{
                createdAt:-1
            }
        }
    ])

    const options={
        page:page,
        limit:limit,
        customLabels:{
            totalDocs:"totalpost",
            docs:"posts"
        }
    }

    //use aggregatepaginate
    const result=await Post.aggregatePaginate(aggregate,options)

    if(!result.posts.length){
        return res.status(200).json(
            new ApiResponse(200,result,"no posts found")
        )

    }

     return res
        .status(200)
        .json(new ApiResponse(200, result, "Posts fetched successfully"));

})