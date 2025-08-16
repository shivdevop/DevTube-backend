import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getDashboard=asyncHandler(async(req,res)=>{
    const userId=req.user._id 
    if(!userId){
        throw new ApiError(401,"User not authenticated")
    }

    //user profile
    const userProfile=await User.findById(userId).select("username email avatar").lean()

    //playlist created by user 
    const userPlaylists=await Playlist.find({owner:userId}).select("title description createdAt").lean()

    //total subscribers
    const totalSubscribers=await Subscription.countDocuments({
        channel:userId
    })

    // total videos
    const totalVideos=await Video.countDocuments({
        owner:userId
    })

    //total views in the last 7 days. need to add the feature !!! 

    // subscribers gained in last week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const subsGainedLastWeek = await Subscription.countDocuments({
    channel: userId,
    createdAt: { $gte: lastWeek },
  });

  // 6. Recent Activity
  const [recentVideos, recentPosts, recentComments, recentLikes] =
    await Promise.all([
      Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title thumbnail createdAt")
        .lean(),

      Post.find({ owner: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("content createdAt")
        .lean(),

      Comment.find({ owner: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("content video post createdAt")
        .lean(),

      Like.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("video post createdAt")
        .lean(),
    ]);

  let activity = [
    ...recentVideos.map((v) => ({ type: "video", ...v })),
    ...recentPosts.map((p) => ({ type: "post", ...p })),
    ...recentComments.map((c) => ({ type: "comment", ...c })),
    ...recentLikes.map((l) => ({ type: "like", ...l })),
  ];

  activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentActivity = activity.slice(0, 10);

   const data={
    profile: userProfile,
    userPlaylists,
    stats: {
      totalSubscribers,
      totalVideos,
      subsGainedLastWeek
    },
    recentActivity,
  }
    
  return res.status(200).json(
    new ApiResponse(200,data,"dashboard fetched successfully")
  )


})