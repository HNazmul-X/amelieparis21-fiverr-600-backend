const { body } = require("express-validator");
const UserModel = require("../Model/UserModel");

const signupValidator = [
    body("firstname").not().isEmpty().withMessage("firstname is Required").isLength({ min: 2, max: 40 }).withMessage("firstname must be between 2 to 40 character").trim(),
    body("lastname").not().isEmpty().withMessage("firstname is Required").isLength({ min: 2, max: 40 }).withMessage("firstname must be between 2 to 40 character").trim(),
    body("username")
        .notEmpty()
        .withMessage("username is required and must be unique")
        .trim()
        .custom(async (username) => {
            const isUsernameExist = await UserModel.findOne({ username: username });
            if (isUsernameExist) {
                throw new Error("Username Already Used for any one. Please try another");
            } else {
                if (username.indexOf(" ") >= 0) {
                    throw new Error("username doesn't allow space");
                } else return true;
            }
        }),
    body("email")
        .not()
        .isEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("email must be a valid email address")
        .normalizeEmail({gmail_remove_dots:false,})
        .trim()
        .not()
        .isEmpty()
        .withMessage("email cannot be empty")
        .custom(async (email) => {
            const isUserExist = await UserModel.findOne({ email: email });
            if (isUserExist) {
                throw new Error("Email is already registered. Please Use another");
            } else {
                return true;
            }
        }),
    body("password")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$!#%*?&]{8,}$/)
        .withMessage("password must be minimum 8 characters  one special character , one uppercase and one lowercase letter required")
        .not()
        .isEmpty()
        .withMessage("Password Must be required"),
    body("confirmPassword").custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body?.password) {
            throw new Error("Password must be match");
        } else {
            return true;
        }
    }),
];

exports.signupValidator = signupValidator;
