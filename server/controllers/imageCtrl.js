const {uploadImageToCloudinary} = require("../config/imageUploader")
const fs = require('fs');

exports.imageUpload = async(req,res)=>{
    try{
    const {thumbnail} = req.files 
    console.log(thumbnail)



    const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )

      res.status(200).json({
        success:true,
        message:"Image upload successfully",
        thumbnailImage
      })


    }catch(error){

    }
}





exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ success: false, message: 'No files were uploaded.' });
    }
console.log(req.files)
    const files = req.files.thumbnail; // Assumes files are uploaded with the name 'thumbnail'
    const urls = [];

    // Ensure files is an array
    const fileArray = Array.isArray(files) ? files : [files];

    // Upload each file to Cloudinary
    for (const file of fileArray) {
      const newpath = await uploadImageToCloudinary(file, process.env.FOLDER_NAME);
      urls.push(newpath);
      fs.unlinkSync(file.tempFilePath); // Delete the temp file
    }

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      images: urls
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ success: false, message: 'Image upload failed', error });
  }
};