// purchaseOrderRoute.js
const express = require("express");
const {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getSinglePurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,updateItemQualityStatus,
  updatePaymentDetailsPurchase,
  vendorDetailsWithPurchaseOrders
} = require("../controllers/purchaseCtrl");

const router = express.Router();

router.post("/create", createPurchaseOrder);
router.get("/getAll", getAllPurchaseOrders);
router.get("/get/:id", getSinglePurchaseOrder);
router.put("/update/:id", updatePurchaseOrder);
router.delete("/delete/:id", deletePurchaseOrder);
router.put("/update-quality/:purchaseOrderId", updateItemQualityStatus);
router.put("/update-payment/:orderId", updatePaymentDetailsPurchase);
router.get("/user/:vendorId",  vendorDetailsWithPurchaseOrders)


module.exports = router;
