const {body} = require("express-validator")

const loginValidator = [
    body("usernameOrEmail").notEmpty().withMessage("username or email cannot be empty"),
    body("password").notEmpty().withMessage("username or email cannot be empty")
]

module.exports = loginValidator