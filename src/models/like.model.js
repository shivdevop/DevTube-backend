import mongoose, { mongo } from "mongoose";

const likeSchema=new mongoose.Schema({
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post" 
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},
{
    timestamps:true
})


// Ensure only one target type per like
likeSchema.index({ video: 1, likedBy: 1 }, { unique: true, partialFilterExpression: { video: { $exists: true } } });
likeSchema.index({ comment: 1, likedBy: 1 }, { unique: true, partialFilterExpression: { comment: { $exists: true } } });
likeSchema.index({ post: 1, likedBy: 1 }, { unique: true, partialFilterExpression: { post: { $exists: true } } });
  
export const Like=mongoose.model("Like",likeSchema) 