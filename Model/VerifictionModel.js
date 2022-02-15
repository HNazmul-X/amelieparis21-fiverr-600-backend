const { Schema, model } = require("mongoose");

const verificationSchema = new Schema(
    {
        code: {
            type: String,
            minLength: 6,
        },
        isUsed: {
            type: Boolean,
            default: false,
        },
        expireAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: true,
    },
);

verificationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 });

const VerificationModel = model("Verification", verificationSchema);

module.exports = VerificationModel;
