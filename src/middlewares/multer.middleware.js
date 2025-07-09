import multer from "multer"

// Local disk storage (temp — useful if uploading to Cloudinary later)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname);
  }
});
//multer can handle the file that comes in the req body 


export const upload=multer({storage})

