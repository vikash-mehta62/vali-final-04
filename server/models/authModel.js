const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
        },
        storeName: {
            type: String,
            trim: true,
        },
        ownerName: {
            type: String,
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        zipCode: {
            type: String,
            trim: true,
        },
        businessDescription: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        priceCategory: {
            type: String,
            default:"price"
        },
        shippingCost: {
            type: Number,
            default:0
        },

        agreeTerms: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            enum: ["member", "store", "admin"],
            default: "member",
        },
        isOrder: {
            type: Boolean,
            default: false,
        },
        isProduct: {
            type: Boolean,
            default: false,
        },

        token: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("auth", authSchema);
