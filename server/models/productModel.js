const mongoose = require("mongoose");


const updatedFromOrdersSchema = new mongoose.Schema({
    purchaseOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseOrder',

    },
    oldQuantity: {
        type: Number,

    },
    newQuantity: {
        type: Number,

    },
    perLb: {
        type: Number,

    },
    totalLb: {
        type: Number,

    },
    difference: {
        type: Number,

    },
}, { _id: false });


const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },




        quantity: {
            type: Number,
            default: 0,
        },
        // BOXES
        totalSell: {
            type: Number,
            default: 0,
        },
        totalPurchase: {
            type: Number,
            default: 0,
        },
        remaining: {
            type: Number,
            default: 0,
        },
        // LB's
        unitPurchase: {
            type: Number,
            required: true,
            default: 0,
        },
        unitRemaining: {
            type: Number,
            required: true,
            default: 0,
        },
        unitSell: {
            type: Number,
            required: true,
            default: 0,
        },



        purchaseHistory: [
            {
                date: { type: Date, required: true },
                quantity: { type: Number, default: 0 },
            }
        ],
        salesHistory: [
            {
                date: { type: Date, required: true },
                quantity: { type: Number, default: 0 },
            }
        ],
        lbPurchaseHistory: [
            {
                date: { type: Date, required: true },
                weight: { type: Number, default: 0 },
                lb: { type: String }
            }
        ],
        lbSellHistory: [
            {
                date: { type: Date, required: true },
                weight: { type: Number, default: 0 },
                lb: { type: String }
            }
        ],


        quantityTrash: [
            {
                quantity: { type: Number, required: true },
                type: { type: String, enum: ['box', 'unit'], required: true },
                reason: { type: String, default: 'expired' },
                date: { type: Date, default: Date.now }
            }
        ],
        manuallyAddBox:   {
                quantity: { type: Number, required: true,default:0 },
                date: { type: Date, default: Date.now },
                
            },
        manuallyAddUnit:   {
                quantity: { type: Number, required: true,default:0 },
                date: { type: Date, default: Date.now }
            },

        unit: {
            type: String,


        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        threshold: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            required: true,
        },
        enablePromotions: {
            type: Boolean,
            default: false,
        },
        palette: {
            type: String,
        },
        bulkDiscount: [
            {
                minQuantity: { type: Number, required: true },
                discountPercent: { type: Number, required: true },
                quantity: { type: Number },
                discountPercentage: { type: Number },
            }
        ],
        weightVariation: {
            type: Number,
            default: 0,
        },
        expiryDate: {
            type: Date,
        },
        batchInfo: {
            type: String,
        },
        origin: {
            type: String,
        },
        organic: {
            type: Boolean,
            default: false,
        },
        storageInstructions: {
            type: String,
        },
        boxSize: {
            type: Number,
            default: 0,
        },
        pricePerBox: {
            type: Number,
            default: 0,
        },
        image:
        {
            type: String,
        },
        shippinCost: {
            type: Number,
            default: 0
        },
        updatedFromOrders: {
            type: [updatedFromOrdersSchema],
            default: []
        }


    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
