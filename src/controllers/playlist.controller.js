
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

 
// Create a new playlist
export const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, isPublic = false } = req.body;

    const userId=req.user._id
    if(!userId){
        throw new ApiError(401,"user not authenticated")
    }
    
    if (!name?.trim()) {
        throw new ApiError(400, "Playlist name is required");
    }
    
    const playlist = await Playlist.create({
        name,
        description: description?.trim() || "",
        owner: req.user._id,
        isPublic
    });
    
    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist");
    }
    
    return res.status(201).json(
        new ApiResponse(201, playlist, "Playlist created successfully")
    );
});


// Get user's playlists
export const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    
    const playlists = await Playlist.find({ owner: userId });
    
    return res.status(200).json(
        new ApiResponse(200, playlists, "User playlists fetched successfully")
    );
});

// Get playlist by ID
export const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    
    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }
    
    const playlist = await Playlist.findById(playlistId)
        .populate("owner", "username fullName avatar")
        .populate("videos", "title thumbnail duration views");
    
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    
    // Check if playlist is public or user is owner
    if (!playlist.isPublic && playlist.owner._id.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not authorized to access this playlist");
    }
    
    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched successfully")
    );
});


// Add video to playlist
export const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    
    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist ID and Video ID are required");
    }
    
    // Check if video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    // Check if playlist exists and user is owner
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist");
    }
    
    // Check if video is already in playlist
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in playlist");
    }
    
    playlist.videos.push(videoId);
    await playlist.save();
    
    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
});


// Remove video from playlist
export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    
    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist ID and Video ID are required");
    }
    
    // Check if playlist exists and user is owner
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist");
    }
    
    // Check if video exists in playlist
    const videoIndex = playlist.videos.indexOf(videoId);
    if (videoIndex === -1) {
        throw new ApiError(400, "Video not found in playlist");
    }
    

    //remove video from playlist 
    playlist.videos.splice(videoIndex, 1);
    await playlist.save();
    
    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist successfully")
    );
});


// Update playlist details (name, description or visibility status)
export const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description, isPublic } = req.body;
    
    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }
    
    // Check if any update data is provided
    if (!name && !description && isPublic === undefined) {
        throw new ApiError(400, "At least one field is required to update");
    }
    
    // Check if playlist exists and user is owner
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist");
    }
    
    // Update playlist fields
    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic;
    
    await playlist.save();
    
    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    );
});


// Delete playlist
export const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    
    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }
    
    // Check if playlist exists and user is owner
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this playlist");
    }
    
    await playlist.deleteOne();
    
    return res.status(200).json(
        new ApiResponse(200, {}, "Playlist deleted successfully")
    );
});


// Toggle playlist privacy (public/private)
export const togglePlaylistPrivacy = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    
    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required");
    }
    
    // Check if playlist exists and user is owner
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist");
    }
    
    playlist.isPublic = !playlist.isPublic;
    await playlist.save();
    
    return res.status(200).json(
        new ApiResponse(200, playlist, 
            `Playlist is now ${playlist.isPublic ? "public" : "private"}`
        )
    );
});





// // Get all public playlists (with pagination)
// export const getAllPublicPlaylists = asyncHandler(async (req, res) => {
//     const { page = 1, limit = 10 } = req.query;
    
//     const aggregate = Playlist.aggregate([
//         {
//             $match: {
//                 isPublic: true
//             }
//         },
//         {
//             $lookup: {
//                 from: "users",
//                 localField: "owner",
//                 foreignField: "_id",
//                 as: "owner",
//                 pipeline: [
//                     {
//                         $project: {
//                             username: 1,
//                             fullName: 1,
//                             avatar: 1
//                         }
//                     }
//                 ]
//             }
//         },
//         {
//             $lookup: {
//                 from: "videos",
//                 localField: "videos",
//                 foreignField: "_id",
//                 as: "videos",
//                 pipeline: [
//                     {
//                         $project: {
//                             title: 1,
//                             thumbnail: 1,
//                             duration: 1,
//                             views: 1
//                         }
//                     }
//                 ]
//             }
//         },
//         {
//             $addFields: {
//                 owner: {
//                     $first: "$owner"
//                 },
//                 totalVideos: {
//                     $size: "$videos"
//                 }
//             }
//         },
//         {
//             $sort: {
//                 createdAt: -1
//             }
//         }
//     ]);
    
//     const options = {
//         page: Number(page),
//         limit: Number(limit)
//     };
    
//     const playlists = await Playlist.aggregatePaginate(aggregate, options);
    
//     return res.status(200).json(
//         new ApiResponse(200, playlists.docs, "Public playlists fetched successfully")
//     );
// });