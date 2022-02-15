const ProfileModel = require("../Model/ProfileModel");
const UserModel = require("../Model/UserModel");

exports.allProfileGetController = async (req, res, next) => {
    try {
        const currentPage = parseInt(req.query.pageNo) || 1;
        const itemPerPage = parseInt(req.query.item) || 10;
        const totalDocuments = await ProfileModel.countDocuments();
        console.log(req.query.pageNO);

        const allProfileData = await ProfileModel.find({})
            .skip(currentPage * itemPerPage - itemPerPage)
            .limit(itemPerPage)
            .select("phone city")
            .populate({
                path: "user",
                select: "email username isApproved profileTemplate",
            });
        res.json({
            data: allProfileData,
            currentPage,
            itemPerPage,
            totalDocuments,
        });
    } catch (e) {
        next(e);
        }
};

exports.singleProfileByIdGetController = async (req, res, next) => {
    try {
        const { profileId } = req.params;
        const { select } = req.query;
        const singleProfile = await ProfileModel.findById(profileId).select(select ? select : "");
        res.json(singleProfile);
    } catch (e) {
        next(e);
    }
};

exports.getProfileByFiltering = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

exports.updateProfileStatus = async (req, res, next) => {
    try {
    } catch (e) {
        next(e);
    }
};

// Getting all Profile by User filtering Status
exports.getProfileByUserFiltering = async (req, res, next) => {
    try {
        const isApproved = req.query.isApproved;
        const currentPage = parseInt(req.query.pageNo) || 1;
        const itemPerPage = parseInt(req.query.limit) || 10;
        const totalDocuments = await UserModel.countDocuments({ isApproved });
        const profiles = await UserModel.find({ isApproved })
            .skip(currentPage * itemPerPage - itemPerPage)
            .limit(itemPerPage)
            .select("isApproved email username profileTemplate")
            .populate("profile", "phone city");
        res.json({
            data: profiles,
            currentPage,
            itemPerPage,
            totalDocuments: totalDocuments,
        });
    } catch (e) {
        next(e);
    }
};
