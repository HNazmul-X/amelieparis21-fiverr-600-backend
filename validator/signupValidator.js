const { body } = require("express-validator");
const UserModel = require("../Model/UserModel");

const signupValidator = [
    body("firstname").not().isEmpty().withMessage("le prénom est Obligatoire").isLength({ min: 2, max: 40 }).withMessage("le prénom doit comporter entre 2 et 40 caractères").trim(),
    body("lastname").not().isEmpty().withMessage("le nom de famille est obligatoire").isLength({ min: 2, max: 40 }).withMessage("le nom de famille doit comporter entre 2 et 40 caractères").trim(),
    body("username")
        .notEmpty()
        .withMessage("le nom d'utilisateur est requis et doit être unique")
        .trim()
        .custom(async (username) => {
            const isUsernameExist = await UserModel.findOne({ username: username });
            if (isUsernameExist) {
                throw new Error("Nom d'utilisateur déjà utilisé pour n'importe qui. Veuillez en essayer un autre");
            } else {
                if (username.indexOf(" ") >= 0) {
                    throw new Error("le nom d'utilisateur n'autorise pas d'espace");
                } else return true;
            }
        }),
    body("email")
        .not()
        .isEmpty()
        .withMessage("e-mail est requis")
        .isEmail()
        .withMessage("l'e-mail doit être une adresse e-mail valide")
        .normalizeEmail({ gmail_remove_dots: false })
        .trim()
        .not()
        .isEmpty()
        .withMessage("l'e-mail ne peut pas être vide")
        .custom(async (email) => {
            const isUserExist = await UserModel.findOne({ email: email });
            if (isUserExist) {
                throw new Error("L'adresse e-mail est déjà utilisée. Veuillez utiliser un autre");
            } else {
                return true;
            }
        }),
    body("password")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$!#%*?&]{8,}$/)
        .withMessage("le mot de passe doit comporter au moins 8 caractères un caractère spécial, une majuscule et une minuscule requis")
        .not()
        .isEmpty()
        .withMessage("Mot de passe Doit être requis"),
    body("confirmPassword").custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body?.password) {
            throw new Error("Le mot de passe doit correspondre");
        } else {
            return true;
        }
    }),
];

exports.signupValidator = signupValidator;
