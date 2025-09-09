const Warehouse = require("../models/warehouseModel");
const ProductLocation = require("../models/productLocationModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");

// @desc    Create new warehouse
// @route   POST /api/v1/warehouse/create
// @access  Private (Admin only)
exports.createWarehouse = asyncHandler(async (req, res) => {
    const {
        name,
        code,
        state,
        city,
        address,
        coordinates,
        capacity,
        zones,
        deliveryRadius,
        operatingHours,
        timezone,
        manager
    } = req.body;

    // Check if warehouse code already exists
    const existingWarehouse = await Warehouse.findOne({ code: code.toUpperCase() });
    if (existingWarehouse) {
        return res.status(400).json({
            success: false,
            message: "Warehouse with this code already exists"
        });
    }

    // Create default zones if not provided
    const defaultZones = zones || [
        { name: 'Receiving', capacity: capacity.total * 0.1 },
        { name: 'Cold Storage', capacity: capacity.total * 0.3, temperature: 35 },
        { name: 'Dry Storage', capacity: capacity.total * 0.4 },
        { name: 'Frozen Storage', capacity: capacity.total * 0.1, temperature: 0 },
        { name: 'Shipping', capacity: capacity.total * 0.1 }
    ];

    const warehouse = await Warehouse.create({
        name,
        code: code.toUpperCase(),
        state: state.toUpperCase(),
        city,
        address,
        coordinates,
        capacity: {
            total: capacity.total,
            available: capacity.total
        },
        zones: defaultZones,
        deliveryRadius: deliveryRadius || 100,
        operatingHours: operatingHours || {
            monday: { open: '08:00', close: '18:00' },
            tuesday: { open: '08:00', close: '18:00' },
            wednesday: { open: '08:00', close: '18:00' },
            thursday: { open: '08:00', close: '18:00' },
            friday: { open: '08:00', close: '18:00' },
            saturday: { open: '08:00', close: '16:00' },
            sunday: { open: '10:00', close: '14:00' }
        },
        timezone: timezone || 'America/New_York',
        manager
    });

    res.status(201).json({
        success: true,
        message: "Warehouse created successfully",
        data: warehouse
    });
});

// @desc    Get all warehouses
// @route   GET /api/v1/warehouse/getAll
// @access  Private
exports.getAllWarehouses = asyncHandler(async (req, res) => {
    const { state, isActive } = req.query;
    
    const filter = {};
    if (state) filter.state = state.toUpperCase();
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const warehouses = await Warehouse.find(filter)
        .sort({ state: 1, name: 1 });

    res.status(200).json({
        success: true,
        count: warehouses.length,
        data: warehouses
    });
});

// @desc    Get warehouse by ID
// @route   GET /api/v1/warehouse/get/:id
// @access  Private
exports.getWarehouse = asyncHandler(async (req, res) => {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
        return res.status(404).json({
            success: false,
            message: "Warehouse not found"
        });
    }

    // Get inventory summary for this warehouse
    const inventorySummary = await ProductLocation.aggregate([
        { $match: { warehouse: warehouse._id, isActive: true } },
        {
            $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalBoxes: { $sum: '$quantities.totalBoxes' },
                totalUnits: { $sum: '$quantities.totalUnits' },
                availableBoxes: { $sum: '$quantities.availableBoxes' },
                availableUnits: { $sum: '$quantities.availableUnits' }
            }
        }
    ]);

    const warehouseData = {
        ...warehouse.toObject(),
        inventory: inventorySummary[0] || {
            totalProducts: 0,
            totalBoxes: 0,
            totalUnits: 0,
            availableBoxes: 0,
            availableUnits: 0
        }
    };

    res.status(200).json({
        success: true,
        data: warehouseData
    });
});

// @desc    Update warehouse
// @route   PUT /api/v1/warehouse/update/:id
// @access  Private (Admin only)
exports.updateWarehouse = asyncHandler(async (req, res) => {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
        return res.status(404).json({
            success: false,
            message: "Warehouse not found"
        });
    }

    const updatedWarehouse = await Warehouse.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "Warehouse updated successfully",
        data: updatedWarehouse
    });
});

// @desc    Delete warehouse
// @route   DELETE /api/v1/warehouse/delete/:id
// @access  Private (Admin only)
exports.deleteWarehouse = asyncHandler(async (req, res) => {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
        return res.status(404).json({
            success: false,
            message: "Warehouse not found"
        });
    }

    // Check if warehouse has inventory
    const hasInventory = await ProductLocation.findOne({ 
        warehouse: warehouse._id, 
        isActive: true,
        $or: [
            { 'quantities.totalBoxes': { $gt: 0 } },
            { 'quantities.totalUnits': { $gt: 0 } }
        ]
    });

    if (hasInventory) {
        return res.status(400).json({
            success: false,
            message: "Cannot delete warehouse with existing inventory"
        });
    }

    await Warehouse.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Warehouse deleted successfully"
    });
});

// @desc    Get warehouses by state
// @route   GET /api/v1/warehouse/by-state/:state
// @access  Private
exports.getWarehousesByState = asyncHandler(async (req, res) => {
    const { state } = req.params;
    
    const warehouses = await Warehouse.find({ 
        state: state.toUpperCase(), 
        isActive: true 
    }).sort({ name: 1 });

    res.status(200).json({
        success: true,
        count: warehouses.length,
        data: warehouses
    });
});

// @desc    Find nearest warehouse to coordinates
// @route   GET /api/v1/warehouse/nearest
// @access  Private
exports.findNearestWarehouse = asyncHandler(async (req, res) => {
    const { latitude, longitude, maxDistance = 100 } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({
            success: false,
            message: "Latitude and longitude are required"
        });
    }

    const warehouses = await Warehouse.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                },
                distanceField: "distance",
                maxDistance: maxDistance * 1609.34, // Convert miles to meters
                spherical: true,
                query: { isActive: true }
            }
        },
        {
            $addFields: {
                distanceInMiles: { $divide: ["$distance", 1609.34] }
            }
        },
        { $limit: 5 }
    ]);

    res.status(200).json({
        success: true,
        count: warehouses.length,
        data: warehouses
    });
});

// @desc    Get warehouse inventory summary
// @route   GET /api/v1/warehouse/:id/inventory
// @access  Private
exports.getWarehouseInventory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { zone, lowStock } = req.query;

    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
        return res.status(404).json({
            success: false,
            message: "Warehouse not found"
        });
    }

    const matchConditions = { warehouse: warehouse._id, isActive: true };
    if (zone) matchConditions.zone = zone;

    let pipeline = [
        { $match: matchConditions },
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productInfo'
            }
        },
        { $unwind: '$productInfo' },
        {
            $addFields: {
                needsReorderBoxes: { $lte: ['$quantities.availableBoxes', '$reorderPoint.boxes'] },
                needsReorderUnits: { $lte: ['$quantities.availableUnits', '$reorderPoint.units'] }
            }
        }
    ];

    if (lowStock === 'true') {
        pipeline.push({
            $match: {
                $or: [
                    { needsReorderBoxes: true },
                    { needsReorderUnits: true }
                ]
            }
        });
    }

    const inventory = await ProductLocation.aggregate(pipeline);

    // Get summary statistics
    const summary = await ProductLocation.aggregate([
        { $match: matchConditions },
        {
            $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalBoxes: { $sum: '$quantities.totalBoxes' },
                totalUnits: { $sum: '$quantities.totalUnits' },
                availableBoxes: { $sum: '$quantities.availableBoxes' },
                availableUnits: { $sum: '$quantities.availableUnits' },
                allocatedBoxes: { $sum: '$quantities.allocatedBoxes' },
                allocatedUnits: { $sum: '$quantities.allocatedUnits' }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        warehouse: warehouse.name,
        summary: summary[0] || {},
        inventory,
        count: inventory.length
    });
});

// @desc    Get reorder alerts for warehouse
// @route   GET /api/v1/warehouse/:id/reorder-alerts
// @access  Private
exports.getReorderAlerts = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const reorderAlerts = await ProductLocation.findReorderNeeded(id);

    res.status(200).json({
        success: true,
        count: reorderAlerts.length,
        data: reorderAlerts
    });
});

// @desc    Get warehouse performance metrics
// @route   GET /api/v1/warehouse/:id/metrics
// @access  Private
exports.getWarehouseMetrics = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
        return res.status(404).json({
            success: false,
            message: "Warehouse not found"
        });
    }

    // This would typically involve complex aggregations across orders, inventory movements, etc.
    // For now, returning the stored metrics
    const metrics = {
        warehouse: warehouse.name,
        state: warehouse.state,
        metrics: warehouse.metrics,
        inventory: {
            totalProducts: warehouse.totalProducts,
            totalValue: warehouse.totalValue,
            utilizationPercentage: ((warehouse.capacity.total - warehouse.capacity.available) / warehouse.capacity.total * 100).toFixed(2)
        },
        isCurrentlyOpen: warehouse.isCurrentlyOpen()
    };

    res.status(200).json({
        success: true,
        data: metrics
    });
});

module.exports = {
    createWarehouse: exports.createWarehouse,
    getAllWarehouses: exports.getAllWarehouses,
    getWarehouse: exports.getWarehouse,
    updateWarehouse: exports.updateWarehouse,
    deleteWarehouse: exports.deleteWarehouse,
    getWarehousesByState: exports.getWarehousesByState,
    findNearestWarehouse: exports.findNearestWarehouse,
    getWarehouseInventory: exports.getWarehouseInventory,
    getReorderAlerts: exports.getReorderAlerts,
    getWarehouseMetrics: exports.getWarehouseMetrics
};