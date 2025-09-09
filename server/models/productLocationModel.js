const mongoose = require("mongoose");

const ProductLocationSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true
    },
    zone: {
        type: String,
        required: true,
        enum: ['Receiving', 'Cold Storage', 'Dry Storage', 'Frozen Storage', 'Shipping', 'Quality Control']
    },
    binLocation: {
        type: String, // e.g., "A1-01-05" (Aisle-Bay-Shelf)
        required: true
    },
    // Inventory quantities at this location
    quantities: {
        totalBoxes: { type: Number, default: 0 },
        totalUnits: { type: Number, default: 0 },
        availableBoxes: { type: Number, default: 0 }, // not allocated to orders
        availableUnits: { type: Number, default: 0 },
        allocatedBoxes: { type: Number, default: 0 }, // reserved for orders
        allocatedUnits: { type: Number, default: 0 },
        damagedBoxes: { type: Number, default: 0 },
        damagedUnits: { type: Number, default: 0 }
    },
    // Lot/Batch tracking
    lots: [{
        lotNumber: { type: String, required: true },
        expiryDate: { type: Date },
        receivedDate: { type: Date, default: Date.now },
        supplier: { type: String },
        boxes: { type: Number, default: 0 },
        units: { type: Number, default: 0 },
        status: { 
            type: String, 
            enum: ['active', 'quarantine', 'expired', 'damaged'],
            default: 'active'
        }
    }],
    // Reorder settings for this location
    reorderPoint: {
        boxes: { type: Number, default: 0 },
        units: { type: Number, default: 0 }
    },
    maxCapacity: {
        boxes: { type: Number, default: 1000 },
        units: { type: Number, default: 10000 }
    },
    // Movement history
    movements: [{
        type: { 
            type: String, 
            enum: ['receive', 'ship', 'transfer', 'adjust', 'damage', 'expire'],
            required: true 
        },
        quantity: { type: Number, required: true },
        unit: { type: String, enum: ['box', 'unit'], required: true },
        reference: { type: String }, // order ID, transfer ID, etc.
        reason: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date, default: Date.now },
        balanceAfter: {
            boxes: { type: Number, required: true },
            units: { type: Number, required: true }
        }
    }],
    // Temperature requirements
    temperatureRange: {
        min: { type: Number }, // in Fahrenheit
        max: { type: Number }
    },
    // Last cycle count
    lastCycleCount: {
        date: { type: Date },
        countedBoxes: { type: Number },
        countedUnits: { type: Number },
        systemBoxes: { type: Number },
        systemUnits: { type: Number },
        variance: {
            boxes: { type: Number },
            units: { type: Number }
        },
        countedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Compound indexes for better performance
ProductLocationSchema.index({ product: 1, warehouse: 1 }, { unique: true });
ProductLocationSchema.index({ warehouse: 1, zone: 1 });
ProductLocationSchema.index({ binLocation: 1 });
ProductLocationSchema.index({ 'lots.expiryDate': 1 });

// Virtual for total available inventory
ProductLocationSchema.virtual('totalAvailable').get(function() {
    return {
        boxes: this.quantities.availableBoxes,
        units: this.quantities.availableUnits
    };
});

// Virtual for inventory value (requires product price)
ProductLocationSchema.virtual('inventoryValue').get(function() {
    // This would need to be populated with product data
    return 0; // Placeholder
});

// Method to check if reorder is needed
ProductLocationSchema.methods.needsReorder = function() {
    return {
        boxes: this.quantities.availableBoxes <= this.reorderPoint.boxes,
        units: this.quantities.availableUnits <= this.reorderPoint.units
    };
};

// Method to get expiring lots (within X days)
ProductLocationSchema.methods.getExpiringLots = function(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    
    return this.lots.filter(lot => 
        lot.expiryDate && 
        lot.expiryDate <= cutoffDate && 
        lot.status === 'active'
    );
};

// Method to record inventory movement
ProductLocationSchema.methods.recordMovement = function(movementData) {
    const movement = {
        ...movementData,
        balanceAfter: {
            boxes: this.quantities.totalBoxes,
            units: this.quantities.totalUnits
        }
    };
    
    this.movements.push(movement);
    
    // Keep only last 100 movements to prevent document size issues
    if (this.movements.length > 100) {
        this.movements = this.movements.slice(-100);
    }
};

// Static method to find products needing reorder across all locations
ProductLocationSchema.statics.findReorderNeeded = function(warehouseId = null) {
    const match = { isActive: true };
    if (warehouseId) {
        match.warehouse = warehouseId;
    }
    
    return this.aggregate([
        { $match: match },
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
        }
    ]);
};

module.exports = mongoose.model("ProductLocation", ProductLocationSchema);