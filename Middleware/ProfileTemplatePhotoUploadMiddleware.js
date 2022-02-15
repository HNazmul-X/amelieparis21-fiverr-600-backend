const path = require("path")
const multer = require("multer")
const crypto = require("crypto")

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, `public/upload/profileTemplateImg`);
    },
    filename:(req,file,cb) => {
        cb(null,`Upload__${file.fieldname}__${crypto.randomUUID()}__${file.originalname}`)
    }
});

const profileTemplateUpload = multer({
    storage,
    limits:{
        fileSize:1024*1024*2
    },
    fileFilter:(req,file,cb) => {
        const types = /jpeg|jpg|svg|png|webp|gif/
        const extName = types.test(path.extname(file.originalname).toLocaleLowerCase())
        const mimetype = types.test(file.mimetype)
        if(extName && mimetype){
            cb(null,true)
        } else{
            cb(new Error("Only supported png,jpeg,jpg,gif,webp and svg format image"));
        }
    },
    
})

module.exports = profileTemplateUpload