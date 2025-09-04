const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    type: { type: String, enum: ["lead", "customer", "partner"], required: true },
    status: { type: String, enum: ["active", "inactive", "new"], required: true },
    tags: { type: [String], default: [] },
    businessCategory: { type: String },
    businessSubcategory: { type: String },
    purchaseVolume: { type: String },
    preferredDeliveryDay: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);
