import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { userRegisterSchema } from "../validators/user.validation.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser= asyncHandler(async (req,res)=>{
    //get user details from frontend (basically data from postman)
    // validation - not empty 
    //check if user already exists: username, email
    //we also need to do file handling, so we'll use multer middleware in routes 
    //if user exists, send error response 
    //check for cover image, check for avatar(avatar is required)
    //upload them to cloudinary, get the url from the response
    //create user object - create a new user in database 
    //remove password and refresh token from response 
    //check if user is created successfully 


    //get user details
    const {fullname,username,email,password} =req.body 
    console.log("email",email)

    //validation of input
    const parsed=userRegisterSchema.safeParse(
        {fullname,username,email,password}
    )
    if (!parsed.success){
        throw new ApiError(400,"INVALID INPUT")
    } 

    //check if user already exists
    const existingUser=await User.findOne({
        $or:[{username},{email}]
    })
    if (existingUser){
        throw new ApiError(409,"user with email or username already exists")
    }

    //check for avatar
    //multer gives us the files in req.files
    //we have used the multer middleware named upload in the router
    //we have used upload.fields() in the router, so we will get files in req.files

    const avatarLocalPath=req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverImage[0]?.path
    console.log(avatarLocalPath, coverImageLocalPath)
    if (!avatarLocalPath){
        throw new ApiError(400,"avatar is required for registration")
    }

    //we need to upload the files to cloudinary
    const avatarResponse=await uploadOnCloudinary(avatarLocalPath)
    const coverImageResponse=await uploadOnCloudinary(coverImageLocalPath)
   console.log(avatarResponse)
    if (!avatarResponse){
        throw new ApiError(500,"avatar upload failed on cloudinary")
    }

    //create user object
    const userResponse=await User.create({
        fullname,
        username:username.toLowerCase(),
        email,
        avatar:avatarResponse.url,
        coverImage:coverImageResponse?.url||"",
        password,//password will be hashed in the model pre-save hook

    })

    //check if user is created successfully and we are removing password and refreshToken from the response
    const createduser=await User.findById(userResponse._id).select(
        "-password -refreshToken"
    )

    if(!createduser){
        throw new ApiError(500,"user creation failed")
    }

    //send response
    return res.status(201).json(
        new ApiResponse(200, createduser,"user created successfully")
    )

})

export {registerUser}