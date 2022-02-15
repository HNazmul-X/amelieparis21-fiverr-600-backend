const { signupValidator } = require("../validator/signupValidator");
const {
    signupPostController,
    loginPostController,
    verifyTokenPostController,
    SendVerificationCode,
    verifyProfileCreation,
    verifyEmailCode,
    resetPwdCodeSending,
    isVerificationSessionExist,
    userPwdChange,
} = require("../Controller/UserAuthController");
const loginValidator = require("../validator/loginValidator");

const authRouter = require("express").Router();

authRouter.post("/login", [loginValidator], loginPostController);

authRouter.post("/signup", signupValidator, signupPostController);

authRouter.post("/verify-token", verifyTokenPostController);

authRouter.post("/send-email", SendVerificationCode);
authRouter.post("/verify-profile/", verifyProfileCreation);
authRouter.post("/verify-code", verifyEmailCode);

authRouter.post("/reset-pwd-code-sending", resetPwdCodeSending);
authRouter.post("/is-verification-session-exist", isVerificationSessionExist);
authRouter.post("/change-password/:userId/:verificationId", userPwdChange);

module.exports = authRouter;
