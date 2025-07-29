import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { userRegisterSchema } from "../validators/user.validation.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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

export {registerUser,loginUser,logoutUser}