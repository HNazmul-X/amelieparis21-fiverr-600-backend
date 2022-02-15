const playgroundRouter = require("express").Router();
const profileTemplateUpload = require("../Middleware/ProfileTemplatePhotoUploadMiddleware");
const CardModel = require("../Model/CardsModel");
const ProfileTemplateModel = require("../Model/ProfileTemplateModel");
const UserModel = require("../Model/UserModel");

playgroundRouter.get("/", async (req, res, next) => {
    const card = await CardModel.findById("61d32874c101170025d0ffc4");
    res.json(card);
});
playgroundRouter.post("/playground", (req, res, next) => {
    ProfileTemplateModel.find().then((doc) => {
        
        res.json(doc)
    });
});

module.exports = playgroundRouter;
