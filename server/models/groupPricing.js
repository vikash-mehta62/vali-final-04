const mongoose = require('mongoose');

const GroupPricingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    storeId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth',
    }],
    product_arrayjson: [{
        new_price: String,
        product_id: String,
        product_name: String,
        actual_price: String,
        groupLabel: String,
    }],
}, { timestamps: true });

module.exports = mongoose.model('GroupPricing', GroupPricingSchema);
