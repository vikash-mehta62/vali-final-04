const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ['farmer', 'supplier', 'distributor', 'other'],
            default: 'supplier',
        },
        contactName: { type: String },
        email: { type: String },
        phone: { type: String },
        address: { type: String },
        notes: { type: String },
        productsSupplied: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
