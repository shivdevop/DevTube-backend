import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken"
import brcypt from "bcrypt"

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, //cloudinary url
        required:true
    },
    coverImage:{
        type:String //cloudinary url
    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:'Video'
    },
    password:{
        type:String,
        required:[true,'Password is required']
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})

//hook to hash password before saving
userSchema.pre("save",async function (next){
    if(!this.isModified("password"))
        return next() //if password is not modified, skip hashing
    this.password=await brcypt.hash(this.password, 10) 
    next() 
})

//method to compare password
userSchema.methods.isPasswordCorrect=async function(password){
    return await brcypt.compare(password,this.password)
}

//methods to generate access token
userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}

//method to generate refresh token
userSchema.methods.generateRefreshToken=function(){
      return jwt.sign({
        _id:this._id,
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}


export const User=mongoose.model('User',userSchema)