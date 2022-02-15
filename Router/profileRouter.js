const { allProfileGetController, singleProfileByIdGetController, updateProfileStatus, getProfileByUserFiltering } = require("../Controller/profileController");
const { isAuthenticated } = require("../Middleware/isAuthenticated");

const profileRouter = require("express").Router();

profileRouter.get("/all-profile", isAuthenticated, allProfileGetController);
profileRouter.get("/single-profile/:profileId", isAuthenticated, singleProfileByIdGetController);
profileRouter.post("/update-profile-status/:profileId", isAuthenticated, updateProfileStatus);
profileRouter.get("/get-profile-by-user-filter",  getProfileByUserFiltering);

module.exports = profileRouter;
