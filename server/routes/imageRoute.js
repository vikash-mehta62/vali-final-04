const express = require("express")
const router = express.Router()



const {
    imageUpload,
    uploadImages
} = require("../controllers/imageCtrl")

router.post("/upload", imageUpload)
router.post("/multi", uploadImages)


module.exports = router


