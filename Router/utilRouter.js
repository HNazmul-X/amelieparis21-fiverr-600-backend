const { deleteUnUsedProfileTemplateImage, sendContactFormDataToMail } = require("../Controller/utilController");
const utilRouter = require("express").Router();

//all Router
utilRouter.get("/delete-un-used-profile-template-image", deleteUnUsedProfileTemplateImage);
utilRouter.post("/send-contact-form-data-to-mail",sendContactFormDataToMail)

//exporting default
module.exports = utilRouter;
