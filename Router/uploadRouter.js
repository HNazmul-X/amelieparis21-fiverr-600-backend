const { uploadCardImage } = require("../Controller/uploadController");
const cardPhotoUpload = require("../Middleware/CardPhotoUploadMiddleware");

const uploadRouter = require("express").Router();

uploadRouter.post(
    "/upload-card-image",
    cardPhotoUpload.fields([
        { name: "backSide", maxCount: 1 },
        { name: "frontSide", maxCount: 1 },
    ]),
    uploadCardImage,
);

module.exports = uploadRouter;
