const mongoose = require("mongoose");

const priceListTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["draft", "active", "archived"], default: "draft" },

    products: [
      {
        type: mongoose.Schema.Types.Mixed, 
        required: true
      }
    ],

    emailDistributionGroups: [{ type: String }],
    lastSent: { type: Date },
    emailSubject: { type: String },
    emailBody: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PriceListTemplate", priceListTemplateSchema);
