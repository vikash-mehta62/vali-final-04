
const express = require("express");
const { 
  createProductCtrl, 
  getAllProductCtrl, 
  deleteProductCtrl, 
  updateProductCtrl, 
  getSingleProductCtrl, 
  updateProductPrice, 
  bulkDiscountApply,
  getProductsByStore,
  getWeeklyOrdersByProductCtrl,
  updateTotalSellForAllProducts,
  getAllProductsWithHistorySummary,
  addToTrash,
  compareProductSalesWithOrders,
  resetAndRebuildHistoryForSingleProductCtrl,
  addToManually,
  resetAllProductStats,
  resetAndRebuildHistoryFromOrders,
  resetSalesForLastTwoDays,
  resetAndRebuildHistoryForSingleProduct,
  deleteOrdersForLastTwoDays,
  resetAndRebuildHistoryForAllProducts
} = require("../controllers/productCtrl");
const router = express.Router();

// Core product operations
router.post("/create", createProductCtrl)
router.get("/getAll", getAllProductCtrl)
router.get("/getAllSummary", getAllProductsWithHistorySummary)
router.get("/get/:id", getSingleProductCtrl)
router.delete("/delete/:id", deleteProductCtrl)
router.put("/update/:id", updateProductCtrl)

// Product analytics and orders
router.get("/get-order/:productId", getWeeklyOrdersByProductCtrl)
router.get("/updateQuantity", updateTotalSellForAllProducts)
router.get("/com", compareProductSalesWithOrders)

// Pricing and discounts
router.put("/update-price", updateProductPrice)
router.put("/update-bulk-discounts", bulkDiscountApply)

// Inventory management
router.post("/trash", addToTrash)
router.post("/addQuantity", addToManually)

// History and data management
router.get('/reset-history/:productId', resetAndRebuildHistoryForSingleProductCtrl)

// Admin utility routes (use with caution)
router.post("/admin/reset-all-stats", resetAllProductStats)
router.post("/admin/rebuild-from-orders", resetAndRebuildHistoryFromOrders)
router.post("/admin/reset-last-two-days", resetSalesForLastTwoDays)
router.post("/admin/delete-orders-last-two-days", deleteOrdersForLastTwoDays)
router.post("/admin/rebuild-all-history", resetAndRebuildHistoryForAllProducts)

module.exports = router
