import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

//req has access to cookies, so we can access the tokens from cookies
//this is possible because of the cookie-parser middleware 

export const verifyUser = asyncHandler(async(req,res,next)=>{
   try {
     const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
 
     if (!token){
         throw new ApiError(401,"Unauthorized request")
     }
     
     //if token is present, verify it 
     const decoded=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
     const user=await User.findById(decoded?._id).select("-password -refreshToken")
      
     if(!user){
         throw new ApiError(401,"invalid access token")
     }
     //if user is found, attach user to request object
     //we have access to req object 
     req.user=user
     next()
   } catch (error) {
       throw new ApiError(401,error?.message || "invalid access token ")
   }
})

