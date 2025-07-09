import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if (!localFilePath) return null
        //upload file to cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto" //this will automatically detect the kind of file uploaded
        })
        console.log("file uploaded on cloudinary", response.url)
        return response
    }catch(error){
        fs.unlinkSync(localFilePath) //remove the file from local storage as upload failed
        return null
    }
}

export {uploadOnCloudinary}
