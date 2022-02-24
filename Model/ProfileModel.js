const { Schema, model } = require("mongoose");

const profileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        firstname: {
            type: String,
            required: true,
            trim: true,
            maxLength: 40,
            minLength: 2,
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
            maxLength: 40,
            minLength: 2,
        },
        address: {
            type: String,
            trim: true,
        },
        additional_address: {
            type: String,
            trim: true,
        },
        society: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        postalCode: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        cards: [
            {
                type: Schema.Types.ObjectId,
                ref: "Cards",
            },
        ],
        country: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

const ProfileModel = model("Profile", profileSchema);
module.exports = ProfileModel;
