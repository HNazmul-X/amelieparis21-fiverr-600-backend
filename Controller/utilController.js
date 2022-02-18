const fs = require("fs");
const ProfileTemplateModel = require("../Model/ProfileTemplateModel");
const SendEmail = require("../util/SendingEmail");

exports.deleteUnUsedProfileTemplateImage = async (req, res, next) => {
    try {
        let allUsedImage = [],
            allUnUsedImage = [],
            deletedCount = 0;

        fs.readdir(process.cwd() + "/public/upload/profileTemplateImg", async (error, allImages) => {
            if (error) return next(error);

            const profileTemplateImages = await ProfileTemplateModel.find({}).select("photos");
            [...profileTemplateImages].forEach((photo) => {
                allUsedImage.push(photo.photos.cover.split("/")[3]);
                allUsedImage.push(photo.photos.profile.split("/")[3]);
            });

            [...allImages].forEach((image) => {
                if (!allUsedImage.includes(image)) {
                    allUnUsedImage.push(image);
                }
            });

            if (allUnUsedImage.length === 0) return res.json({ error: "You don't have any an Used Images" });

            allUnUsedImage.forEach((image) => {
                fs.unlink(`${process.cwd()}/public/upload/profileTemplateImg/${image}`, (err) => {
                    if (err) return next(err);
                    deletedCount++;
                    if (deletedCount === allImages.length) {
                        res.json({ success: true, deletedCount });
                    }
                });
            });
        });
    } catch (e) {
        next(e);
    }
};

exports.sendContactFormDataToMail = async (req, res, next) => {
    try {
        const { message, name, phone, email } = req.body;
        if (!message || !name || !phone || !email) return res.json({ error: "please Provide all Information" });
        const mailOption = {
            to: "nazmul.w3@gmail.com",
            subject: "Mail From OneCardPro.Com Contact form",
            text: `Hy, I am ${name} \n
            my phone number is ${phone} \n 
            And My email is ${email} \n
           I sent this message for you that is  " ${message} "
            `,
        };

        const sentEmail = await SendEmail.sendEmail(mailOption);
        console.log(sentEmail);
        res.json(sentEmail);
    } catch (e) {
        next(e);
    }
};
