const { deleteUnUsedProfileTemplateImage, sendContactFormDataToMail, deleteVerificationData } = require("../Controller/utilController");
const utilRouter = require("express").Router();

//all Router
utilRouter.get("/delete-un-used-profile-template-image", deleteUnUsedProfileTemplateImage);
utilRouter.post("/send-contact-form-data-to-mail",sendContactFormDataToMail)
utilRouter.delete("/delete-verification-data/:id",deleteVerificationData)

//exporting default
module.exports = utilRouter;
