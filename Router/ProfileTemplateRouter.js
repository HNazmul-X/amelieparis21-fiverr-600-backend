const {
    createProfileTemplateForUser,
    uploadProfileTemplateImagePostController,
    getSingleTemplateDataById,
    updateProfileTemplateDataById,
    updateProfileTemplatePic,
    updateTemplateCoverPic,
    updateTemplateProfilePic,
    getSingleTemplateByUserId,
    getSingleProfileTemplateByUsername,
} = require("../Controller/profileTemplateController");

const { isAuthenticated } = require("../Middleware/isAuthenticated");
const profileTemplateUpload = require("../Middleware/ProfileTemplatePhotoUploadMiddleware");
const profileTemplateRouter = require("express").Router();

profileTemplateRouter.post("/create-profile-template/:userId", createProfileTemplateForUser);
profileTemplateRouter.post("/updated-profileTemplate/:templateId", isAuthenticated, updateProfileTemplateDataById);
profileTemplateRouter.get("/getSingleTemplateData/:templateId", isAuthenticated, getSingleTemplateDataById);

//file handling router
profileTemplateRouter.post(
    "/upload-template-images",
    isAuthenticated,
    profileTemplateUpload.fields([
        { name: "coverPic", maxCount: 1 },
        { name: "profilePic", maxCount: 1 },
    ]),
    uploadProfileTemplateImagePostController,
);

profileTemplateRouter.post("/update-img/cover/:templateId", isAuthenticated, profileTemplateUpload.single("coverPic"), updateTemplateCoverPic);
profileTemplateRouter.post("/update-img/profile/:templateId", isAuthenticated, profileTemplateUpload.single("profilePic"), updateTemplateProfilePic);
profileTemplateRouter.get("/get-single-profile-by-userId/:userId", getSingleTemplateByUserId);
profileTemplateRouter.get("/get-single-profile-by-username/:username", getSingleProfileTemplateByUsername);

module.exports = profileTemplateRouter;

("01307800962");
("01812884708");
