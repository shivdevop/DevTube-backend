import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv";
dotenv.config(); // ✅ ensures env vars are available here

console.log(process.env.CLOUDINARY_API_KEY)
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
        
        // ✅ Clean up local file after success
        if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
        }
        return response
        
    }catch(error){
        console.error("Cloudinary Upload Error:", error);

        if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
        }

        return null;
    }
}

export {uploadOnCloudinary}
