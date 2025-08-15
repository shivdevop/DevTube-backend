import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";

//it will be an authenticated route
export const createComment=asyncHandler(async(req,res)=>{
    const {content,targetId,targetType}=req.body

    //check if user is logged in to comment 
    const userid=req.user._id
    if(!userid){
        throw new ApiError(400,"user not logged in")
    }

    if (!content || !targetId || !targetType){
        throw new ApiError(400,"content, targetId and targetType required")
    }

    if (!["Video","Comment","Post"].includes(targetType)){
        throw new ApiError(400,"invalid target type")
    }



    const commentData = {
    content,
    writtenBy: req.user._id,
    targetType,
    targetId
    };

     if (targetType === "Comment") {
    commentData.parentComment = targetId;
    }

     const comment = await Comment.create(commentData);

    if (!comment){
        throw new ApiError(400,"comment not created")
    }
   

    return res.status(201).json(
        new ApiResponse(201,comment,"comment created successfully")
    )
})


//delete a comment 
//user must be authenticated
//user must be owner of that comment 
export const deleteComment=asyncHandler(async(req,res)=>{
    const {commentid}=req.params
    const comment=await Comment.findById(commentid)
    
    if (!comment){
        throw new ApiError(400,"comment not found")
    }
    
    const userid=req.user._id
    if (comment.writtenBy.toString()!==userid.toString()){
        throw new ApiError(400,"user not authorized")
    }

    const result=await Comment.deleteOne({
        _id:commentid
    })

    if (!result.deletedCount){
        throw new ApiError(400,"Comment not deleted")
    }
    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: commentid })

    res.status(200).json(
        new ApiResponse(200,"comment and all its replies deleted successfully")
    )


})


//get comments for a video,comment or post 
//user doesn't need to be authenticated 
export const getComments = asyncHandler(async (req, res) => {
  const { targetType, targetId } = req.query;

  if (!["Video","Comment","Post"].includes(targetType)){
        throw new ApiError(400,"invalid target type")
    }

  const comments = await Comment.find({
    targetType,
    targetId,
    parentComment: null, // only root level
  })
    .populate("writtenBy", "username avatar")
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, comments));
});


//get replies for a comment 
export const getReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const replies = await Comment.find({ parentComment: commentId })
    .populate("writtenBy", "username avatar")
    .sort({ createdAt: 1 });

  res.status(200).json(new ApiResponse(200, replies));
});
