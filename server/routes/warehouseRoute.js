const express = require("express");
const router = express.Router();
const {
    createWarehouse,
    getAllWarehouses,
    getWarehouse,
    updateWarehouse,
    deleteWarehouse,
    getWarehousesByState,
    findNearestWarehouse,
    getWarehouseInventory,
    getReorderAlerts,
    getWarehouseMetrics
} = require("../controllers/warehouseCtrl");
const { auth } = require("../middleware/auth");

// Create new warehouse (Admin only)
router.post("/create", auth, createWarehouse);

// Get all warehouses
router.get("/getAll", auth, getAllWarehouses);

// Get warehouse by ID
router.get("/get/:id", auth, getWarehouse);

// Update warehouse (Admin only)
router.put("/update/:id", auth, updateWarehouse);

// Delete warehouse (Admin only)
router.delete("/delete/:id", auth, deleteWarehouse);

// Get warehouses by state
router.get("/by-state/:state", auth, getWarehousesByState);

// Find nearest warehouse
router.get("/nearest", auth, findNearestWarehouse);

// Get warehouse inventory
router.get("/:id/inventory", auth, getWarehouseInventory);

// Get reorder alerts for warehouse
router.get("/:id/reorder-alerts", auth, getReorderAlerts);

// Get warehouse performance metrics
router.get("/:id/metrics", auth, getWarehouseMetrics);

module.exports = router;