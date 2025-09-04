const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
