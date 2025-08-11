import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { userRegisterSchema } from "../validators/user.validation.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens= async (userId)=>{
 try {
    const user = await User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
    user.refreshToken =refreshToken 
    await user.save({validateBeforeSave: false}) //save the refresh token in database
    //don't ask for password validation here, as we are not changing the password 

    return {accessToken,refreshToken}


 } catch (error) {
    throw new ApiError(500,"error generating tokens")
 }
}


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


const loginUser= asyncHandler(async(req,res)=>{
    //get user details from frontend (data from req body)
    //check if username or email is provided 
    //check if user exists in database 
    //if user exists, check if password is correct 
    //if password is correct, generate access token and refresh token 
    //send response with user details and tokens in secure cookies 

    const {email,username,password}=req.body

    //check is username or email is provided 
    if (!(username || email)){
        throw new ApiError(400,"username or email is required ")
    }

    //check if user exists 
    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if (!user){
        throw new ApiError(404,"user not found")
    }

    //if user exists, check if password is correct
    //we have have ispasswordcorrect method in user model 

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"invalid password")
    }

    //generate access token and refresh token 
    const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    
    //send cookies with tokens

    const options ={
        httpOnly:true,
        secure:true 
    }

    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{
         user:loggedInUser,accessToken,refreshToken
    },"user logged in successfully"
  ))


})



const logoutUser=asyncHandler(async(req,res)=>{

    //now we have access to user object from verifyUser middleware 

    // await User.findByIdAndUpdate(req.user._id,{
    //     $set:{
    //         refreshToken:undefined
    //     }},
    //     {
    //         new:true
    //     }
    // )

    await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: "" } },
    { new: true }
  );


        const options ={
        httpOnly:true,
        secure:true 
        }

    return res.status(200).clearCookie("accessToken",options)
    .clearCookie("refreshToken",options).json(new ApiResponse(200,{},"user logged out ")) 

    
})

//refreshaccesstoken function 
//user ke pass encryped refresh token hoga 
//not necessary that decoded refresh token will be same as the one in db 
//even after decoding the refresh token, we need to check if user exists !!

 const refreshAccessToken=asyncHandler(async(req,res)=>{
    //get refresh token from cookies

    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
     if (!incomingRefreshToken){
        throw new ApiError(401,"refresh token require") 
     }

     try {
        //verify the refresh token 
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
   
        const user = await User.findById(decodedToken?._id)
   
        if (!user){
           throw new ApiError(401,"invalid refresh token ")
        }
   
       if (incomingRefreshToken !== user?.refreshToken) {
           throw new ApiError (401, "refresh token mismatch")
       }
   
       //generate new access token and refresh token
       const {accessToken,newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
   
   
       const options ={
           httpOnly:true,
           secure:true
       }
   
       return res.status(200).cookie("accessToken",accessToken,options)
       .cookie("refreshToken",newrefreshToken,options)
       .json(
           new ApiResponse(
               200,
               {accessToken,newrefreshToken},
               "new access token and refresh token generated successfully"
               )
       )
     } catch (error) {

        throw new ApiError(401, error?.message || "invalid refresh token")    
     }


})


//change user password function 
const changeUserPassword=asyncHandler(async(req,res)=>{
    //if user if logged in, then auth middleware has run and user object is attached to req object 

    const {currentPassword,newPassword}=req.body

    if (!currentPassword || !newPassword){
        throw new ApiError(400,"current and new password are required")
    }

    const user=await User.findById(req.user._id)
    const ispasswordCorrect=await user.isPasswordCorrect(currentPassword)

    if (!ispasswordCorrect){
        throw new ApiError(401,"current password is incorrect")
    }

    //set new password 
    user.password=newPassword 
    await user.save({validateBeforeSave:false})

    //send response 
    return res.status(200).json(
        new ApiResponse(200,{},"password changed successfully")
    )

})

//if user is logged in, then auth middleware has run and we have access to current user

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(
        new ApiResponse(200,req.user,"current user fetched ")
    )
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullname,email}=req.body

    if (!fullname && !email){
        throw new ApiError(400,"no update data provided")
    }


    //find the user by id
    const user=await User.findById(req.user?._id)

    if(!user){
        throw new ApiError(404,"user not found")
    }

    //check for email uniqueness 
    if (email && email!==user.email){
        const existingEmailUser=await User.findOne({email})
        if (existingEmailUser){
            throw new ApiError(409,"email already in use")
        }
        user.email=email
    }

    if (fullname){
        user.fullname=fullname
    }

    await user.save({validateBeforeSave:false})
    user.password = undefined;
    user.refreshToken = undefined;

    
    //no need to query the db again
    // const updatedUser=await User.findById(user._id).select("-password -refreshToken")
     
    res.status(200).json(
        new ApiResponse(200,user,"account details updated successfully")
    )

})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    
    //multer middleware will handle the file upload and we will get the file in req.files
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is missing")
    }

    const avatarResponse=await uploadOnCloudinary(avatarLocalPath)
    if (!avatarResponse.url){
        throw new ApiError(400,"error uploading avatar to cloudinary")
    }

    const user=await User.findByIdAndUpdate(req.user?._id,{
       $set:{
        avatar:avatarResponse.url
       }
    },
    {new:true}).select("-password -refreshToken")

    res.status(200).json(
        new ApiResponse(200,user,"avatar updated successfully")
    )
})



const updateUserCoverImage=asyncHandler(async(req,res)=>{
    
    //multer middleware will handle the file upload and we will get the file in req.files
    const coverImageLocalPath=req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(400,"cover image file is missing")
    }

    const coverImageResponse=await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImageResponse.url){
        throw new ApiError(400,"error uploading cover image to cloudinary")
    }

    const user=await User.findByIdAndUpdate(req.user?._id,{
       $set:{
        coverImage:coverImageResponse.url
       }
    },
    {new:true}).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200,user,"cover image updated successfully")
    )
})


const getUserChannelProfile=asyncHandler(async(req,res)=>{
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"username is missing")
    }

    //let's use aggregation to get user details
   //remember that model name is Subscription but collection name will be subscriptions
    const channel=await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        //we are finding who all have subscribed to this channel 
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        //now we need who all have we subscribed to
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"

            }
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                //
                isSubscribed:{
                    $cond:{
                        if:{$in:[new mongoose.Types.ObjectId(req.user._id),"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                fullname:1,
                username:1,
                subscribersCount:1,
                channelsSubscribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1,
                email:1

            }
        }
    ])
    
    //we are getting array of objects, here we are getting only one object

    if (!channel || channel.length===0){
        throw new ApiError(404,"channel not found")
    }

    return res.status(200).json(
        new ApiResponse(200,channel[0],"channel profile fetched successfully")
    )

})



export {registerUser,
         loginUser,
         logoutUser,
         refreshAccessToken,
         changeUserPassword,
         getCurrentUser,
         updateAccountDetails,
         updateUserAvatar,
         updateUserCoverImage,
         getUserChannelProfile}