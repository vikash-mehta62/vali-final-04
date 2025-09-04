const mongoose = require("mongoose");

const UploadedFileSchema = new mongoose.Schema(
  {
    fileName: { type: String,  },
    filePath: { type: String,  },
    fileType: { type: String },
    url: { type: String },
    type: { type: String },
    fileSize: { type: Number },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CreditMemoItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
    reason: { type: String },
    uploadedFiles: [UploadedFileSchema],
  },
  { _id: false }
);

const CreditMemoSchema = new mongoose.Schema(
  {
    creditMemoNumber: { type: String, required: true, unique: true },

    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },

    items: { type: [CreditMemoItemSchema], required: true },

    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processed", "rejected"],
      default: "pending",
    },

    refundMethod: {
      type: String,
      enum: ["store_credit", "bank_transfer", "cash", "other"],
      default: "store_credit",
    },

    reason: { type: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// export default mongoose.models.CreditMemo ||
//   mongoose.model("CreditMemo", CreditMemoSchema);
module.exports = mongoose.model('CreditMemo', CreditMemoSchema);
