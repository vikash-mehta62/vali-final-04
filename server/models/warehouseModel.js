const mongoose = require("mongoose");

const WarehouseZoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['Receiving', 'Cold Storage', 'Dry Storage', 'Frozen Storage', 'Shipping', 'Quality Control']
    },
    temperature: {
        type: Number, // in Fahrenheit
        default: null
    },
    capacity: {
        type: Number,
        required: true,
        default: 1000 // in cubic feet or your preferred unit
    },
    currentUtilization: {
        type: Number,
        default: 0 // percentage
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, { _id: true });

const WarehouseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true // e.g., "ATL-01", "MIA-01"
    },
    state: {
        type: String,
        required: true,
        uppercase: true // e.g., "GA", "FL", "TX"
    },
    city: {
        type: String,
        required: true
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, default: 'USA' }
    },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    capacity: {
        total: { type: Number, required: true }, // total cubic feet
        available: { type: Number, required: true }
    },
    zones: [WarehouseZoneSchema],
    deliveryRadius: {
        type: Number,
        default: 100 // miles
    },
    operatingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    timezone: {
        type: String,
        default: 'America/New_York'
    },
    manager: {
        name: String,
        email: String,
        phone: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Inventory tracking
    totalProducts: {
        type: Number,
        default: 0
    },
    totalValue: {
        type: Number,
        default: 0
    },
    // Performance metrics
    metrics: {
        averageOrderFulfillmentTime: { type: Number, default: 0 }, // in hours
        inventoryTurnover: { type: Number, default: 0 },
        orderAccuracy: { type: Number, default: 100 }, // percentage
        onTimeDelivery: { type: Number, default: 100 } // percentage
    }
}, { timestamps: true });

// Indexes for better performance
WarehouseSchema.index({ state: 1, isActive: 1 });
WarehouseSchema.index({ coordinates: '2dsphere' });
WarehouseSchema.index({ code: 1 });

// Virtual for full address
WarehouseSchema.virtual('fullAddress').get(function() {
    return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}`;
});

// Method to check if warehouse is currently open
WarehouseSchema.methods.isCurrentlyOpen = function() {
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    const todayHours = this.operatingHours[dayName];
    if (!todayHours || !todayHours.open || !todayHours.close) {
        return false;
    }
    
    return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

// Method to calculate distance to a point
WarehouseSchema.methods.distanceTo = function(latitude, longitude) {
    const R = 3959; // Earth's radius in miles
    const dLat = (latitude - this.coordinates.latitude) * Math.PI / 180;
    const dLon = (longitude - this.coordinates.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.coordinates.latitude * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in miles
};

module.exports = mongoose.model("Warehouse", WarehouseSchema);