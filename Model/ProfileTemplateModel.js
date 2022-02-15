const { Schema, model } = require("mongoose");

const profileTemplateSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        templateName: {
            type: String,
            enum: ["profileTemplate1", "profileTemplate2", "profileTemplate3"],
            required: true,
        },
        photos: {
            profile: {
                type: String,
                trim: true,
            },
            cover: {
                type: String,
                trim: true,
            },
        },
        socialLinks: [
            {
                name: {
                    type: String,
                    trim: true,
                    default: "",
                },
                link: {
                    type: String,
                    trim: true,
                    default: "",
                },
                _id: {
                    type: String,
                    default: "",
                },
            },
        ],

        personalInfo: {
            name: {
                type: String,
                trim: true,
                default: "",
            },
            title: {
                type: String,
                trim: true,
                default: "",
            },
            tagline: {
                type: String,
                trim: true,
                default: "",
            },
            about: {
                type: String,
                trim: true,
                default: "",
            },
            address: {
                type: String,
                trim: true,
                default: "",
            },
            tags: [
                {
                    type: String,
                    trim: true,
                },
            ],
        },

        mainButton: {
            text: {
                type: String,
                trim: true,
                default: "",
            },
            link: {
                type: String,
                trim: true,
                default: "#",
            },
        },
        colors: {
            icon: {
                type: String,
                trim: true,
                default: "",
            },
            text: {
                type: String,
                trim: true,
                default: "",
            },
            button: {
                bg: {
                    type: String,
                    trim: true,
                    default: "",
                },
                color: {
                    type: String,
                    trim: true,
                    default: "",
                },
                shadow: {
                    type: String,
                    trim: true,
                    default: "",
                },
            },
        },
    },
    {
        timestamps: true,
    },
);

const ProfileTemplateModel = model("ProfileTemplate", profileTemplateSchema);

module.exports = ProfileTemplateModel;
