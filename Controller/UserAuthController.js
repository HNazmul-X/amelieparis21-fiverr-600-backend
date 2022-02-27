require("dotenv").config();
const ProfileModel = require("../Model/ProfileModel");
const UserModel = require("../Model/UserModel");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SendEmail = require("../util/SendingEmail");
const VerificationModel = require("../Model/VerifictionModel");

/**================================================================
 * =================login controller ==============================
 * ================================================================
 */
exports.loginPostController = async (req, res, next) => {
    const { usernameOrEmail, password } = req.body;
    const isError = validationResult(req).formatWith((e) => e.msg);

    const loginUser = async (user) => {
        try {
            const isPasswordMatch = await bcrypt.compare(password, user?.password);
            if (!isPasswordMatch) {
                return res.json({ error: "Invalid Credentials" });
            } else {
                const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "168h" });

                res.json({
                    isLoggedIn: true,
                    user: user,
                    token: token,
                });
            }
        } catch (e) {
            next(e);
        }
    };

    if (isError.isEmpty()) {
        try {
            const existedUserWithEmail = await UserModel.findOne({ email: usernameOrEmail });
            const existedUserWithUsername = await UserModel.findOne({ username: usernameOrEmail });
            if (existedUserWithEmail || existedUserWithUsername) {
                loginUser(existedUserWithEmail || existedUserWithUsername);
            } else {
                return res.json({ error: "Invalid Credentials" });
            }
        } catch (e) {
            next(e);
        }
    } else {
        res.json({ error: "failed to login", ...isError.mapped() });
    }
};

/**================================================================
 * ================= signup controller ==============================
 * ================================================================
 */
exports.signupPostController = async (req, res, next) => {
    const { username, email, password, firstname, lastname, address, additional_address, phone, society, postalCode, country, city } = req.body;
    const isError = validationResult(req).formatWith(e => e.msg)


    if (isError.isEmpty()) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            if (hashedPassword) {
                const createdUser = await new UserModel({ username, email, password: hashedPassword }).save();

                if (createdUser) {
                    const createdProfile = await new ProfileModel({
                        firstname,
                        lastname,
                        address,
                        additional_address,
                        phone,
                        society,
                        postalCode,
                        country,
                        city,
                        user: createdUser._id,
                    }).save();

                    if (createdProfile) {
                        const updatedUser = await UserModel.findOneAndUpdate(
                            { _id: createdUser._id },
                            {
                                $set: {
                                    profile: createdProfile._id,
                                },
                            },
                            { new: true },
                        );
                        console.log({ user: updatedUser });
                        const token = jwt.sign({ user: updatedUser }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "168h" });
                        res.json({ user: updatedUser, token: token });
                    }
                }
            }
        } catch (e) {
            console.log(e);
            next(e);
        }
    } else {
        res.json({
            ...isError.mapped(),
            error: "Please filled Up all requirement",
        });
    }
};

/**================================================================
 * =================  V E R I F Y   S I G N U P     ===============
 * ================================================================
 */
exports.verifySignupData = async (req, res, next) => {
    try {
        const isError = validationResult(req).formatWith((e) => e.msg);
        if (!isError.isEmpty()) res.json({ error: Object.values(isError.formatWith((e) => e.msg).mapped()) });
        else res.send(true);
    } catch (e) {
        next(e);
    }
};

/**================================================================
 * =================  V E R I F Y   T O K N   =====================
 * ================================================================
 */

exports.verifyTokenPostController = async (req, res, next) => {
    const { token } = req.body;
    if (token) {
        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (error, decoded) => {
                if (error) {
                    return res.json({ error: "invalid signature" });
                }
                delete decoded?.user?.password;
                const newUser = await UserModel.findById(decoded?.user?._id);
                if (newUser) {
                    const user = {
                        isLoggedIn: true,
                        ...newUser._doc,
                        token,
                    };
                    res.json({ user });
                } else {
                    res.json({ user: undefined });
                }
            });
        } catch (e) {
            next(e);
        }
    } else {
        res.json({ error: "token is not provided" });
    }
};

exports.SendVerificationCode = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log(email);
        const isEmailSend = await SendEmail.SendVerificationEmail(email);
        res.send(isEmailSend);
    } catch (e) {
        console.log(e);
    }
};

exports.verifyProfileCreation = async (req, res, next) => {
    try {
        const { code, id, userId } = req.body;
        const isVerificationDataFound = await VerificationModel.findById(id);
        if (!isVerificationDataFound) {
            return res.json({ error: "con not verified user, may be your code is expired or data not found" });
        } else {
            const isCodeMatch = await bcrypt.compare(code, isVerificationDataFound?.code);

            if (!isCodeMatch) {
                return res.json({ error: "invalid Code" });
            } else {
                const modifiedUser = await UserModel.findOneAndUpdate(
                    { _id: userId },
                    {
                        $set: {
                            isVerified: true,
                        },
                    },
                    {
                        new: true,
                    },
                );
                const token = jwt.sign({ user: modifiedUser }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "168h" });
                res.json({ user: modifiedUser, isLoggedIn: true, token });
            }
        }
    } catch (e) {
        console.log(e);
        next(e);
    }
};

exports.verifyEmailCode = async (req, res, next) => {
    const { id, code } = req.body;
    try {
        const isCodeMatched = await SendEmail.verifyCode(code, id);
        const file= "/public"
        console.log(isCodeMatched)
        if (isCodeMatched && isCodeMatched) {
            res.json({ success: "Verification Successfully", res: true });
        } else {
            res.json({ error: "Invalid Code" });
        }
    } catch (e) {
        next(e);
    }
};

exports.userSingleData = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id).select(req.query.select || "");
        res.json(user);
    } catch (e) {
        next(e);
    }
};

exports.getSingleUserByProfileId = async (req, res, next) => {
    try {
        const profileId = req.params.profileId;
        const user = await ProfileModel.findById(profileId).select("_id").populate("user");
        res.json(user);
    } catch (e) {
        next(e);
    }
};

//updating single user profile Status
exports.updateSingeUserStatusById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { status } = req.body;
        const updated_user = await UserModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    isApproved: status,
                },
            },
            { new: true },
        );
        console.log(updated_user);
        if (updated_user.isApproved) {
            res.send(true);
        } else {
            res.json({ error: "Failed to Updated Status" });
        }
    } catch (e) {
        next(e);
    }
};

//sending email for sending email to user
exports.resetPwdCodeSending = async (req, res, next) => {
    try {
        const { email } = req.body;
        console.log(email);
        const User = await UserModel.findOne({ email: email.toLowerCase() });
        if (!User) {
            return res.json({ error: "User not found" });
        } else {
            const sentEmail = await SendEmail.SendVerificationEmail(email, "pwd|reset");
            res.json({ code: sentEmail.code, _id: sentEmail._id, userId: User._id });
        }
    } catch (e) {
        next(e);
    }
};

// checking Is User Exist by userId.
exports.isUserExist = async (req, res, next) => {
    try {
        const queryParam = req.query;
        if (Object.values(queryParam).length === 0) {
            return res.json({ error: "Please set query for searching field" });
        } else {
            const user = await UserModel.find(queryParam);
            res.json(user);
        }
    } catch (e) {
        next(e);
    }
};

//checking is Verification Credentials still valid now
exports.isVerificationSessionExist = async (req, res, next) => {
    try {
        const { id, code } = req.body;
        console.log(req.body);
        if (id && code) {
            const verification = await VerificationModel.findById(id);
            if (verification && !verification.isUsed && verification.code === code) {
                res.json({ success: true });
            } else {
                res.json({ error: "session is not still exist now" });
            }
        } else {
            res.json({ error: "Please Provide all Information" });
        }
    } catch (e) {
        next(e);
    }
};

//change Password for user
exports.userPwdChange = async (req, res, next) => {
    try {
        const { userId, verificationId } = req.params;
        const { password } = req.body;
        const enc_pass = await bcrypt.hash(password, 10);
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    password: enc_pass,
                },
            },
            { new: true },
        );
        const token = jwt.sign({ user: updatedUser }, process.env.ACCESS_TOKEN_SECRET);
        await VerificationModel.findByIdAndDelete(verificationId);
        res.json({
            isLoggedIn: true,
            user: updatedUser,
            token: token,
        });
    } catch (e) {
        next(e);
    }
};
