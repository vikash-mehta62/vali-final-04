const express = require("express");
const router = express.Router();
const {
    createProductLocation,
    getAllProductLocations,
    getProductLocation,
    updateProductLocation,
    adjustInventory,
    getInventoryByState,
    transferInventory,
    getLowStockAlerts,
    getInventorySummary
} = require("../controllers/productLocationCtrl");
const { auth } = require("../middleware/auth");

// Create product location
router.post("/create", auth, createProductLocation);

// Get all product locations
router.get("/getAll", auth, getAllProductLocations);

// Get product location by ID
router.get("/get/:id", auth, getProductLocation);

// Update product location
router.put("/update/:id", auth, updateProductLocation);

// Adjust inventory quantities
router.put("/:id/adjust", auth, adjustInventory);

// Get inventory by state
router.get("/by-state/:state", auth, getInventoryByState);

// Transfer inventory between warehouses
router.post("/transfer", auth, transferInventory);

// Get low stock alerts
router.get("/low-stock", auth, getLowStockAlerts);

// Get inventory summary by state
router.get("/summary/:state", auth, getInventorySummary);

// Seed inventory data (development only)
router.post("/seed-data", auth, async (req, res) => {
    try {
        const { seedInventoryData } = require("../utils/seedInventoryData");
        await seedInventoryData();
        res.status(200).json({
            success: true,
            message: "Inventory data seeded successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error seeding inventory data",
            error: error.message
        });
    }
});

module.exports = router;