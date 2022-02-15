const { type } = require("express/lib/response");
const { Schema, model } = require("mongoose");

const deliveryInfoSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        card: {
            type: Schema.Types.ObjectId,
            ref: "Card",
        },
        orderDate: {
            type: Number,
            default: Date.now(),
        },
        deliver_info: {
            firstname: {
                type: String,
                trim: true,
                maxLength: 40,
                minLength: 2,
            },
            lastname: {
                type: String,
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
        },
        billing_info: {
            firstname: {
                type: String,
                trim: true,
                maxLength: 40,
                minLength: 2,
            },
            lastname: {
                type: String,
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
        },
        is_billing_same: Boolean,
        comment_on: {
            type: String,
            default: "",
            maxLength: 400,
        },
        promoCode: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

const DeliverInfoModel = model("DeliveryInfo", deliveryInfoSchema);
module.exports = DeliverInfoModel;
