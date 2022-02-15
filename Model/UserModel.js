const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        email: {
            type: String,
            trim: true,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            minLength: 2,
            maxLength: 100,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default: "/upload/default-avatar.png",
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
        profileTemplate: {
            type: Schema.Types.ObjectId,
            ref: "ProfileTemplate",
        },
    },
    {
        timestamps: true,
    },
);

const UserModel = model("User", userSchema);

module.exports = UserModel;
