const ProductLocation = require("../models/productLocationModel");
const Product = require("../models/productModel");
const Warehouse = require("../models/warehouseModel");
const asyncHandler = require("express-async-handler");

// @desc    Create product location (assign product to warehouse)
// @route   POST /api/v1/product-location/create
// @access  Private
const createProductLocation = asyncHandler(async (req, res) => {
    const {
        productId,
        warehouseId,
        zone,
        binLocation,
        quantities,
        reorderPoint,
        maxCapacity,
        temperatureRange
    } = req.body;

    // Verify product and warehouse exist
    const product = await Product.findById(productId);
    const warehouse = await Warehouse.findById(warehouseId);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    if (!warehouse) {
        return res.status(404).json({
            success: false,
            message: "Warehouse not found"
        });
    }

    // Check if product already exists in this warehouse
    const existingLocation = await ProductLocation.findOne({
        product: productId,
        warehouse: warehouseId
    });

    if (existingLocation) {
        return res.status(400).json({
            success: false,
            message: "Product already exists in this warehouse"
        });
    }

    // Validate zone exists in warehouse
    const validZone = warehouse.zones.find(z => z.name === zone);
    if (!validZone) {
        return res.status(400).json({
            success: false,
            message: "Invalid zone for this warehouse"
        });
    }

    const productLocation = await ProductLocation.create({
        product: productId,
        warehouse: warehouseId,
        zone,
        binLocation,
        quantities: quantities || {
            totalBoxes: 0,
            totalUnits: 0,
            availableBoxes: 0,
            availableUnits: 0,
            allocatedBoxes: 0,
            allocatedUnits: 0,
            damagedBoxes: 0,
            damagedUnits: 0
        },
        reorderPoint: reorderPoint || { boxes: 10, units: 100 },
        maxCapacity: maxCapacity || { boxes: 1000, units: 10000 },
        temperatureRange
    });

    await productLocation.populate(['product', 'warehouse']);

    res.status(201).json({
        success: true,
        message: "Product location created successfully",
        data: productLocation
    });
});

// @desc    Get all product locations
// @route   GET /api/v1/product-location/getAll
// @access  Private
const getAllProductLocations = asyncHandler(async (req, res) => {
    const {
        warehouseId,
        productId,
        zone,
        lowStock,
        page = 1,
        limit = 50
    } = req.query;

    const filter = { isActive: true };
    if (warehouseId) filter.warehouse = warehouseId;
    if (productId) filter.product = productId;
    if (zone) filter.zone = zone;

    let pipeline = [
        { $match: filter },
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productInfo'
            }
        },
        {
            $lookup: {
                from: 'warehouses',
                localField: 'warehouse',
                foreignField: '_id',
                as: 'warehouseInfo'
            }
        },
        { $unwind: '$productInfo' },
        { $unwind: '$warehouseInfo' },
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

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push(
        { $skip: skip },
        { $limit: parseInt(limit) }
    );

    const productLocations = await ProductLocation.aggregate(pipeline);

    // Get total count for pagination
    const totalCount = await ProductLocation.countDocuments(filter);

    res.status(200).json({
        success: true,
        count: productLocations.length,
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        currentPage: parseInt(page),
        data: productLocations
    });
});

// @desc    Get product location by ID
// @route   GET /api/v1/product-location/get/:id
// @access  Private
const getProductLocation = asyncHandler(async (req, res) => {
    const productLocation = await ProductLocation.findById(req.params.id)
        .populate('product')
        .populate('warehouse');

    if (!productLocation) {
        return res.status(404).json({
            success: false,
            message: "Product location not found"
        });
    }

    res.status(200).json({
        success: true,
        data: productLocation
    });
});

// @desc    Update product location
// @route   PUT /api/v1/product-location/update/:id
// @access  Private
const updateProductLocation = asyncHandler(async (req, res) => {
    const productLocation = await ProductLocation.findById(req.params.id);

    if (!productLocation) {
        return res.status(404).json({
            success: false,
            message: "Product location not found"
        });
    }

    const updatedLocation = await ProductLocation.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate(['product', 'warehouse']);

    res.status(200).json({
        success: true,
        message: "Product location updated successfully",
        data: updatedLocation
    });
});

// @desc    Adjust inventory quantities
// @route   PUT /api/v1/product-location/:id/adjust
// @access  Private
const adjustInventory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        adjustmentType, // 'receive', 'ship', 'adjust', 'damage', 'expire'
        quantity,
        unit, // 'box' or 'unit'
        reason,
        reference,
        lotNumber,
        expiryDate
    } = req.body;

    const productLocation = await ProductLocation.findById(id)
        .populate('product');

    if (!productLocation) {
        return res.status(404).json({
            success: false,
            message: "Product location not found"
        });
    }

    const adjustmentQuantity = parseInt(quantity);
    if (isNaN(adjustmentQuantity)) {
        return res.status(400).json({
            success: false,
            message: "Invalid quantity"
        });
    }

    // Calculate new quantities based on adjustment type
    let newQuantities = { ...productLocation.quantities };

    switch (adjustmentType) {
        case 'receive':
            if (unit === 'box') {
                newQuantities.totalBoxes += adjustmentQuantity;
                newQuantities.availableBoxes += adjustmentQuantity;
            } else {
                newQuantities.totalUnits += adjustmentQuantity;
                newQuantities.availableUnits += adjustmentQuantity;
            }

            // Add to lot if provided
            if (lotNumber) {
                const existingLot = productLocation.lots.find(lot => lot.lotNumber === lotNumber);
                if (existingLot) {
                    if (unit === 'box') {
                        existingLot.boxes += adjustmentQuantity;
                    } else {
                        existingLot.units += adjustmentQuantity;
                    }
                } else {
                    productLocation.lots.push({
                        lotNumber,
                        expiryDate,
                        boxes: unit === 'box' ? adjustmentQuantity : 0,
                        units: unit === 'unit' ? adjustmentQuantity : 0,
                        status: 'active'
                    });
                }
            }
            break;

        case 'ship':
            if (unit === 'box') {
                if (newQuantities.availableBoxes < adjustmentQuantity) {
                    return res.status(400).json({
                        success: false,
                        message: "Insufficient available boxes"
                    });
                }
                newQuantities.totalBoxes -= adjustmentQuantity;
                newQuantities.availableBoxes -= adjustmentQuantity;
            } else {
                if (newQuantities.availableUnits < adjustmentQuantity) {
                    return res.status(400).json({
                        success: false,
                        message: "Insufficient available units"
                    });
                }
                newQuantities.totalUnits -= adjustmentQuantity;
                newQuantities.availableUnits -= adjustmentQuantity;
            }
            break;

        case 'damage':
            if (unit === 'box') {
                if (newQuantities.availableBoxes < adjustmentQuantity) {
                    return res.status(400).json({
                        success: false,
                        message: "Insufficient available boxes"
                    });
                }
                newQuantities.availableBoxes -= adjustmentQuantity;
                newQuantities.damagedBoxes += adjustmentQuantity;
            } else {
                if (newQuantities.availableUnits < adjustmentQuantity) {
                    return res.status(400).json({
                        success: false,
                        message: "Insufficient available units"
                    });
                }
                newQuantities.availableUnits -= adjustmentQuantity;
                newQuantities.damagedUnits += adjustmentQuantity;
            }
            break;

        case 'adjust':
            // Direct adjustment - can be positive or negative
            if (unit === 'box') {
                newQuantities.totalBoxes += adjustmentQuantity;
                newQuantities.availableBoxes += adjustmentQuantity;

                // Ensure no negative quantities
                if (newQuantities.totalBoxes < 0) newQuantities.totalBoxes = 0;
                if (newQuantities.availableBoxes < 0) newQuantities.availableBoxes = 0;
            } else {
                newQuantities.totalUnits += adjustmentQuantity;
                newQuantities.availableUnits += adjustmentQuantity;

                // Ensure no negative quantities
                if (newQuantities.totalUnits < 0) newQuantities.totalUnits = 0;
                if (newQuantities.availableUnits < 0) newQuantities.availableUnits = 0;
            }
            break;

        default:
            return res.status(400).json({
                success: false,
                message: "Invalid adjustment type"
            });
    }

    // Update quantities
    productLocation.quantities = newQuantities;

    // Record movement
    productLocation.recordMovement({
        type: adjustmentType,
        quantity: adjustmentQuantity,
        unit,
        reference,
        reason,
        user: req.user.id
    });

    await productLocation.save();

    res.status(200).json({
        success: true,
        message: "Inventory adjusted successfully",
        data: productLocation
    });
});

// @desc    Get inventory by state
// @route   GET /api/v1/product-location/by-state/:state
// @access  Private
const getInventoryByState = asyncHandler(async (req, res) => {
    const { state } = req.params;
    const { productId, lowStock } = req.query;

    // First get warehouses in the state
    const warehouses = await Warehouse.find({
        state: state.toUpperCase(),
        isActive: true
    });

    if (warehouses.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No warehouses found in this state"
        });
    }

    const warehouseIds = warehouses.map(w => w._id);

    const matchConditions = {
        warehouse: { $in: warehouseIds },
        isActive: true
    };

    if (productId) matchConditions.product = productId;

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
        {
            $lookup: {
                from: 'warehouses',
                localField: 'warehouse',
                foreignField: '_id',
                as: 'warehouseInfo'
            }
        },
        { $unwind: '$productInfo' },
        { $unwind: '$warehouseInfo' },
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

    // Group by product to get state totals
    pipeline.push({
        $group: {
            _id: '$product',
            productName: { $first: '$productInfo.name' },
            productCategory: { $first: '$productInfo.category' },
            totalBoxes: { $sum: '$quantities.totalBoxes' },
            totalUnits: { $sum: '$quantities.totalUnits' },
            availableBoxes: { $sum: '$quantities.availableBoxes' },
            availableUnits: { $sum: '$quantities.availableUnits' },
            allocatedBoxes: { $sum: '$quantities.allocatedBoxes' },
            allocatedUnits: { $sum: '$quantities.allocatedUnits' },
            warehouses: {
                $push: {
                    warehouseId: '$warehouse',
                    warehouseName: '$warehouseInfo.name',
                    zone: '$zone',
                    binLocation: '$binLocation',
                    quantities: '$quantities'
                }
            },
            needsReorder: {
                $max: {
                    $or: ['$needsReorderBoxes', '$needsReorderUnits']
                }
            }
        }
    });

    const stateInventory = await ProductLocation.aggregate(pipeline);

    // Get state summary
    const stateSummary = await ProductLocation.aggregate([
        { $match: matchConditions },
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

    res.status(200).json({
        success: true,
        state: state.toUpperCase(),
        warehouses: warehouses.length,
        summary: stateSummary[0] || {},
        inventory: stateInventory,
        count: stateInventory.length
    });
});

// @desc    Get low stock alerts across all warehouses
// @route   GET /api/v1/product-location/low-stock
// @access  Private
const getLowStockAlerts = asyncHandler(async (req, res) => {
    const { state, warehouseId } = req.query;

    const matchConditions = { isActive: true };

    if (warehouseId) {
        matchConditions.warehouse = warehouseId;
    } else if (state) {
        // Get warehouses in the state first
        const warehouses = await Warehouse.find({
            state: state.toUpperCase(),
            isActive: true
        });
        matchConditions.warehouse = { $in: warehouses.map(w => w._id) };
    }

    const lowStockItems = await ProductLocation.aggregate([
        { $match: matchConditions },
        {
            $addFields: {
                needsReorderBoxes: { $lte: ['$quantities.availableBoxes', '$reorderPoint.boxes'] },
                needsReorderUnits: { $lte: ['$quantities.availableUnits', '$reorderPoint.units'] }
            }
        },
        {
            $match: {
                $or: [
                    { needsReorderBoxes: true },
                    { needsReorderUnits: true }
                ]
            }
        },
        {
            $lookup: {
                from: 'products',
                localField: 'product',
                foreignField: '_id',
                as: 'productInfo'
            }
        },
        {
            $lookup: {
                from: 'warehouses',
                localField: 'warehouse',
                foreignField: '_id',
                as: 'warehouseInfo'
            }
        },
        { $unwind: '$productInfo' },
        { $unwind: '$warehouseInfo' },
        {
            $project: {
                productName: '$productInfo.name',
                productCategory: '$productInfo.category',
                warehouseName: '$warehouseInfo.name',
                warehouseState: '$warehouseInfo.state',
                zone: 1,
                binLocation: 1,
                availableBoxes: '$quantities.availableBoxes',
                availableUnits: '$quantities.availableUnits',
                reorderPointBoxes: '$reorderPoint.boxes',
                reorderPointUnits: '$reorderPoint.units',
                needsReorderBoxes: 1,
                needsReorderUnits: 1,
                urgencyLevel: {
                    $cond: {
                        if: {
                            $or: [
                                { $eq: ['$quantities.availableBoxes', 0] },
                                { $eq: ['$quantities.availableUnits', 0] }
                            ]
                        },
                        then: 'Critical',
                        else: {
                            $cond: {
                                if: {
                                    $or: [
                                        { $lte: ['$quantities.availableBoxes', { $multiply: ['$reorderPoint.boxes', 0.5] }] },
                                        { $lte: ['$quantities.availableUnits', { $multiply: ['$reorderPoint.units', 0.5] }] }
                                    ]
                                },
                                then: 'High',
                                else: 'Medium'
                            }
                        }
                    }
                }
            }
        },
        { $sort: { urgencyLevel: 1, productName: 1 } }
    ]);

    res.status(200).json({
        success: true,
        count: lowStockItems.length,
        data: lowStockItems
    });
});

// @desc    Get inventory summary by state
// @route   GET /api/v1/product-location/summary/:state
// @access  Private
const getInventorySummary = asyncHandler(async (req, res) => {
    const { state } = req.params;

    // Get warehouses in the state
    const warehouses = await Warehouse.find({
        state: state.toUpperCase(),
        isActive: true
    });

    if (warehouses.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No warehouses found in this state"
        });
    }

    const warehouseIds = warehouses.map(w => w._id);

    // Get inventory summary
    const summary = await ProductLocation.aggregate([
        {
            $match: {
                warehouse: { $in: warehouseIds },
                isActive: true
            }
        },
        {
            $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalBoxes: { $sum: '$quantities.totalBoxes' },
                totalUnits: { $sum: '$quantities.totalUnits' },
                availableBoxes: { $sum: '$quantities.availableBoxes' },
                availableUnits: { $sum: '$quantities.availableUnits' },
                allocatedBoxes: { $sum: '$quantities.allocatedBoxes' },
                allocatedUnits: { $sum: '$quantities.allocatedUnits' },
                damagedBoxes: { $sum: '$quantities.damagedBoxes' },
                damagedUnits: { $sum: '$quantities.damagedUnits' }
            }
        }
    ]);

    // Get low stock count
    const lowStockCount = await ProductLocation.aggregate([
        {
            $match: {
                warehouse: { $in: warehouseIds },
                isActive: true
            }
        },
        {
            $addFields: {
                needsReorder: {
                    $or: [
                        { $lte: ['$quantities.availableBoxes', '$reorderPoint.boxes'] },
                        { $lte: ['$quantities.availableUnits', '$reorderPoint.units'] }
                    ]
                }
            }
        },
        {
            $match: { needsReorder: true }
        },
        {
            $count: "lowStockItems"
        }
    ]);

    res.status(200).json({
        success: true,
        state: state.toUpperCase(),
        warehouses: warehouses.length,
        summary: summary[0] || {
            totalProducts: 0,
            totalBoxes: 0,
            totalUnits: 0,
            availableBoxes: 0,
            availableUnits: 0,
            allocatedBoxes: 0,
            allocatedUnits: 0,
            damagedBoxes: 0,
            damagedUnits: 0
        },
        lowStockItems: lowStockCount[0]?.lowStockItems || 0
    });
});

// @desc    Transfer inventory between warehouses
// @route   POST /api/v1/product-location/transfer
// @access  Private
const transferInventory = asyncHandler(async (req, res) => {
    const {
        fromWarehouseId,
        toWarehouseId,
        productId,
        quantity,
        unit,
        reason
    } = req.body;

    // Validate warehouses exist
    const fromWarehouse = await Warehouse.findById(fromWarehouseId);
    const toWarehouse = await Warehouse.findById(toWarehouseId);

    if (!fromWarehouse || !toWarehouse) {
        return res.status(404).json({
            success: false,
            message: "One or both warehouses not found"
        });
    }

    // Get source location
    const sourceLocation = await ProductLocation.findOne({
        product: productId,
        warehouse: fromWarehouseId,
        isActive: true
    });

    if (!sourceLocation) {
        return res.status(404).json({
            success: false,
            message: "Product not found in source warehouse"
        });
    }

    // Check availability
    const transferQuantity = parseInt(quantity);
    if (unit === 'box' && sourceLocation.quantities.availableBoxes < transferQuantity) {
        return res.status(400).json({
            success: false,
            message: "Insufficient boxes available for transfer"
        });
    }
    if (unit === 'unit' && sourceLocation.quantities.availableUnits < transferQuantity) {
        return res.status(400).json({
            success: false,
            message: "Insufficient units available for transfer"
        });
    }

    // Get or create destination location
    let destinationLocation = await ProductLocation.findOne({
        product: productId,
        warehouse: toWarehouseId,
        isActive: true
    });

    if (!destinationLocation) {
        // Create new location in destination warehouse
        destinationLocation = await ProductLocation.create({
            product: productId,
            warehouse: toWarehouseId,
            zone: 'Receiving', // Default zone
            binLocation: 'TEMP-001', // Temporary location
            quantities: {
                totalBoxes: 0,
                totalUnits: 0,
                availableBoxes: 0,
                availableUnits: 0,
                allocatedBoxes: 0,
                allocatedUnits: 0,
                damagedBoxes: 0,
                damagedUnits: 0
            }
        });
    }

    // Perform transfer
    if (unit === 'box') {
        // Remove from source
        sourceLocation.quantities.totalBoxes -= transferQuantity;
        sourceLocation.quantities.availableBoxes -= transferQuantity;

        // Add to destination
        destinationLocation.quantities.totalBoxes += transferQuantity;
        destinationLocation.quantities.availableBoxes += transferQuantity;
    } else {
        // Remove from source
        sourceLocation.quantities.totalUnits -= transferQuantity;
        sourceLocation.quantities.availableUnits -= transferQuantity;

        // Add to destination
        destinationLocation.quantities.totalUnits += transferQuantity;
        destinationLocation.quantities.availableUnits += transferQuantity;
    }

    // Record movements
    const transferId = `TRF-${Date.now()}`;

    sourceLocation.recordMovement({
        type: 'transfer',
        quantity: -transferQuantity,
        unit,
        reference: transferId,
        reason: `Transfer to ${toWarehouse.name}: ${reason}`,
        user: req.user.id
    });

    destinationLocation.recordMovement({
        type: 'receive',
        quantity: transferQuantity,
        unit,
        reference: transferId,
        reason: `Transfer from ${fromWarehouse.name}: ${reason}`,
        user: req.user.id
    });

    // Save both locations
    await Promise.all([
        sourceLocation.save(),
        destinationLocation.save()
    ]);

    res.status(200).json({
        success: true,
        message: "Inventory transferred successfully",
        transferId,
        data: {
            from: {
                warehouse: fromWarehouse.name,
                newQuantities: sourceLocation.quantities
            },
            to: {
                warehouse: toWarehouse.name,
                newQuantities: destinationLocation.quantities
            }
        }
    });
});

module.exports = {
    createProductLocation,
    getAllProductLocations,
    getProductLocation,
    updateProductLocation,
    adjustInventory,
    getInventoryByState,
    transferInventory,
    getLowStockAlerts,
    getInventorySummary
};