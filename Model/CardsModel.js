const { Schema, model } = require("mongoose");

const cardsSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        card_base: String,
        delivery_info: {
            type: Schema.Types.ObjectId,
            ref: "DeliveryInfo",
        },
        card_status: {
            type: String,
            enum: ["pending", "delivered", "rejected"],
            default: "pending",
        },
        frontSide: {
            logo: {
                type: String,
                trim: true,
                default: "",
            },
            scale: {
                type: Number,
                default: 1,
            },
        },
        backSide: {
            logo: {
                type: String,
                trim: true,
                default: "",
            },
            scale: {
                type: Number,
                default: 1,
            },
            infoAlign: {
                type: "String",
                enum: ["center", "left", "right"],
                default: "left",
            },
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
        position: {
            type: String,
            trim: true,
            default: "",
        },
        email: {
            type: String,
            maxLength: 120,
            trim: true,
            required: true,
        },
        company: {
            type: String,
            trim: true,
            default: "",
        },
        website: {
            type: String,
            trim: true,
            default: "",
        },
        landing: {
            type: String,
            trim: true,
            default: "",
        },
        address: {
            type: String,
            trim: true,
            default: "",
        },
        society: {
            type: String,
            trim: true,
            default: "",
        },
        additional_address: {
            type: String,
            trim: true,
            default: "",
        },
        quantity: {
            type: Number,
            default: 0,
        },
        phone: {
            type: String,
            trim: true,
            default: "",
        },
        postalCode: {
            type: String,
            trim: true,
            default: "",
        },
        city: {
            type: String,
            trim: true,
            default: "",
        },
        country: {
            type: String,
            trim: true,
            default: "",
        },
        telephone: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    },
);

const CardModel = model("Card", cardsSchema);

module.exports = CardModel;
