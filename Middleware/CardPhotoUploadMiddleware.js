const multer = require("multer");
const crypto = require("crypto");
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/upload/card_img");
    },
    filename: (req, file, cb) => {
        const name = `${file.fieldname}_${crypto.randomUUID()}__${Date.now()}__${file.originalname}`;
        cb(null, name);
    },
});

const cardPhotoUpload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req,file,callback) => {
        const types = /png|jpg|jpeg|webp|gif|webp|svg/
        const extName = types.test(path.extname(file.originalname).toLocaleLowerCase())
        const mimetype = types.test(file.mimetype)
        if(extName && mimetype){
            callback(null,true)
        } else{
            cb(new Error("Only supported png,jpeg,jpg,gif,webp and svg format image"))
        }
    }
});


module.exports = cardPhotoUpload