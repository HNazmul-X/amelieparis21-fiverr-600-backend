const ProfileTemplateModel = require("../Model/ProfileTemplateModel");
const UserModel = require("../Model/UserModel");
const fs = require("fs");

exports.createProfileTemplateForUser = async (req, res, next) => {
    try {
        const data = req.body;
        const { userId } = req.params;
        const userData = await UserModel.findById(userId);
        if (userData?.profileTemplate) {
            return res.json({ error: "sorry This user already has a Card" });
        }
        const createdTemplate = await new ProfileTemplateModel(data).save();

        if (createdTemplate) {
            console.log("hi");
            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: userId },
                {
                    $set: { profileTemplate: createdTemplate?._id },
                },
                { new: true },
            );
            res.json(updatedUser);
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
};

/* uploading Profile Template Image With Multer */
exports.uploadProfileTemplateImagePostController = (req, res, next) => {
    try {
        res.json({
            coverPic: `/upload/profileTemplateImg/${req.files["coverPic"][0].filename}`,
            profilePic: `/upload/profileTemplateImg/${req.files["profilePic"][0].filename}`,
        });
    } catch (e) {
        next(e);
    }
};

//Getting Single profile Data
exports.getSingleTemplateDataById = async (req, res, next) => {
    try {
        const { templateId } = req.params;
        const templateData = await ProfileTemplateModel.findById(templateId);
        if (templateData) {
            res.json(templateData);
        } else {
            res.json({ error: "sorry Template is not Found" });
        }
    } catch (e) {
        next(e);
    }
};

//updating profile template Data
exports.updateProfileTemplateDataById = async (req, res, next) => {
    try {
        const { templateId } = req.params;
        const data = req.body;
        const updatedTemplate = await ProfileTemplateModel.findByIdAndUpdate(
            templateId,
            {
                $set: { ...data },
            },
            { new: true },
        );
        if (updatedTemplate) {
            res.json(updatedTemplate);
        } else {
            res.json({ error: "profile Updated Fail" });
        }
    } catch (e) {
        next(e);
    }
};

// delete and update profile template cover image
exports.updateTemplateCoverPic = async (req, res, next) => {
    try {
        if (req.file) {
            const { templateId } = req.params;
            const file = `/upload/profileTemplateImg/${req.file.filename}`;
            const { photos } = await ProfileTemplateModel.findById(templateId).select("photos");

            const returnedTemplate = await ProfileTemplateModel.findByIdAndUpdate(
                templateId,
                {
                    $set: {
                        photos: {
                            ...photos,
                            cover: file,
                        },
                    },
                },
                { new: true },
            );
            if (returnedTemplate) {
                res.send(file);
            }
        }
    } catch (e) {
        next(e);
    }
};

// delete and update profile template cover image
exports.updateTemplateProfilePic = async (req, res, next) => {
    try {
        if (req.file) {
            const { templateId } = req.params;
            const file = `/upload/profileTemplateImg/${req.file.filename}`;
            const { photos } = await ProfileTemplateModel.findById(templateId).select("photos");

            const returnedTemplate = await ProfileTemplateModel.findByIdAndUpdate(
                templateId,
                {
                    $set: {
                        photos: {
                            ...photos,
                            profile: file,
                        },
                    },
                },
                { new: true },
            );
            if (returnedTemplate) {
                res.send(file);
            }
        }
    } catch (e) {
        next(e);
    }
};

// Get single Profile Data by userId
exports.getSingleTemplateByUserId = async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        const TemplateData = await UserModel.findById(userId).select("isApproved username email profileTemplate").populate({
            path: "profileTemplate",
            select: "",
        }).populate("profile","firstname lastname phone");
        console.log(TemplateData);
        if (TemplateData) {
            res.json(TemplateData);
        } else {
            res.json({ error: "user Doesn't exist." });
        }
    } catch (e) {
        next(e);
    }
};

/// getting a single profile data using Username
exports.getSingleProfileTemplateByUsername = async (req, res, next) => {
    try {
        const { username } = req.params;
        const templateData = await UserModel.findOne({ username })
            .select("isApproved username email profileTemplate")
            .populate({
                path: "profileTemplate",
            })
            .populate("profile", "firstname lastname phone");
        res.json(templateData);
    } catch (e) {
        next(e);
    }
};
