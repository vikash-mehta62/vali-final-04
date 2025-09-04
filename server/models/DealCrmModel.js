const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    value: { type: Number, required: true },
    stage: { type: String, required: true },
    contactName: { type: String, required: true },
    closeDate: { type: Date, required: true },
    probability: { type: Number, required: true, min: 0, max: 100 },
    contactEmail: { type: String, required: true, },
    notes: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('Deal', DealSchema);
