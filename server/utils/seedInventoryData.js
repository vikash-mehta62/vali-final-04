const mongoose = require('mongoose');
const Warehouse = require('../models/warehouseModel');
const ProductLocation = require('../models/productLocationModel');
const Product = require('../models/productModel');

const seedInventoryData = async () => {
    try {
        console.log('🌱 Starting inventory data seeding...');

        // Check if warehouses already exist
        const existingWarehouses = await Warehouse.countDocuments();
        if (existingWarehouses > 0) {
            console.log('✅ Warehouses already exist, skipping warehouse creation');
        } else {
            // Create sample warehouses
            const warehouses = [
                {
                    name: 'Atlanta Distribution Center',
                    code: 'ATL-01',
                    state: 'GA',
                    city: 'Atlanta',
                    address: {
                        street: '1234 Industrial Blvd',
                        city: 'Atlanta',
                        state: 'GA',
                        zipCode: '30309',
                        country: 'USA'
                    },
                    coordinates: {
                        latitude: 33.7490,
                        longitude: -84.3880
                    },
                    capacity: {
                        total: 50000,
                        available: 35000
                    },
                    zones: [
                        { name: 'Receiving', temperature: 70, capacity: 5000, currentUtilization: 60 },
                        { name: 'Cold Storage', temperature: 35, capacity: 15000, currentUtilization: 70 },
                        { name: 'Dry Storage', temperature: 70, capacity: 20000, currentUtilization: 65 },
                        { name: 'Frozen Storage', temperature: 0, capacity: 8000, currentUtilization: 80 },
                        { name: 'Shipping', temperature: 70, capacity: 2000, currentUtilization: 40 }
                    ],
                    manager: {
                        name: 'John Smith',
                        email: 'john.smith@company.com',
                        phone: '404-555-0123'
                    }
                },
                {
                    name: 'Miami Distribution Center',
                    code: 'MIA-01',
                    state: 'FL',
                    city: 'Miami',
                    address: {
                        street: '5678 Commerce Way',
                        city: 'Miami',
                        state: 'FL',
                        zipCode: '33101',
                        country: 'USA'
                    },
                    coordinates: {
                        latitude: 25.7617,
                        longitude: -80.1918
                    },
                    capacity: {
                        total: 40000,
                        available: 28000
                    },
                    zones: [
                        { name: 'Receiving', temperature: 75, capacity: 4000, currentUtilization: 55 },
                        { name: 'Cold Storage', temperature: 35, capacity: 12000, currentUtilization: 75 },
                        { name: 'Dry Storage', temperature: 75, capacity: 16000, currentUtilization: 60 },
                        { name: 'Frozen Storage', temperature: 0, capacity: 6000, currentUtilization: 85 },
                        { name: 'Shipping', temperature: 75, capacity: 2000, currentUtilization: 45 }
                    ],
                    manager: {
                        name: 'Maria Rodriguez',
                        email: 'maria.rodriguez@company.com',
                        phone: '305-555-0456'
                    }
                },
                {
                    name: 'Dallas Distribution Center',
                    code: 'DAL-01',
                    state: 'TX',
                    city: 'Dallas',
                    address: {
                        street: '9012 Logistics Dr',
                        city: 'Dallas',
                        state: 'TX',
                        zipCode: '75201',
                        country: 'USA'
                    },
                    coordinates: {
                        latitude: 32.7767,
                        longitude: -96.7970
                    },
                    capacity: {
                        total: 60000,
                        available: 42000
                    },
                    zones: [
                        { name: 'Receiving', temperature: 72, capacity: 6000, currentUtilization: 50 },
                        { name: 'Cold Storage', temperature: 35, capacity: 18000, currentUtilization: 65 },
                        { name: 'Dry Storage', temperature: 72, capacity: 24000, currentUtilization: 70 },
                        { name: 'Frozen Storage', temperature: 0, capacity: 10000, currentUtilization: 75 },
                        { name: 'Shipping', temperature: 72, capacity: 2000, currentUtilization: 35 }
                    ],
                    manager: {
                        name: 'Robert Johnson',
                        email: 'robert.johnson@company.com',
                        phone: '214-555-0789'
                    }
                }
            ];

            await Warehouse.insertMany(warehouses);
            console.log('✅ Sample warehouses created');
        }

        // Get all products and warehouses
        const products = await Product.find().limit(20); // Get first 20 products
        const warehouses = await Warehouse.find();

        if (products.length === 0) {
            console.log('⚠️ No products found. Please create products first.');
            return;
        }

        console.log(`📦 Found ${products.length} products and ${warehouses.length} warehouses`);

        // Check if product locations already exist
        const existingLocations = await ProductLocation.countDocuments();
        if (existingLocations > 0) {
            console.log('✅ Product locations already exist, skipping creation');
            return;
        }

        // Create product locations for each product in each warehouse
        const productLocations = [];
        const zones = ['Cold Storage', 'Dry Storage', 'Frozen Storage'];

        for (const product of products) {
            for (const warehouse of warehouses) {
                // Randomly assign products to different zones
                const zone = zones[Math.floor(Math.random() * zones.length)];
                
                // Generate random bin location
                const aisle = String.fromCharCode(65 + Math.floor(Math.random() * 5)); // A-E
                const bay = String(Math.floor(Math.random() * 20) + 1).padStart(2, '0'); // 01-20
                const shelf = String(Math.floor(Math.random() * 10) + 1).padStart(2, '0'); // 01-10
                const binLocation = `${aisle}${bay}-${shelf}`;

                // Generate realistic inventory quantities
                const totalBoxes = Math.floor(Math.random() * 500) + 50; // 50-550 boxes
                const totalUnits = totalBoxes * (Math.floor(Math.random() * 20) + 10); // 10-30 units per box
                const allocatedBoxes = Math.floor(totalBoxes * 0.1); // 10% allocated
                const allocatedUnits = Math.floor(totalUnits * 0.1);
                const damagedBoxes = Math.floor(totalBoxes * 0.02); // 2% damaged
                const damagedUnits = Math.floor(totalUnits * 0.02);
                const availableBoxes = totalBoxes - allocatedBoxes - damagedBoxes;
                const availableUnits = totalUnits - allocatedUnits - damagedUnits;

                productLocations.push({
                    product: product._id,
                    warehouse: warehouse._id,
                    zone,
                    binLocation,
                    quantities: {
                        totalBoxes,
                        totalUnits,
                        availableBoxes,
                        availableUnits,
                        allocatedBoxes,
                        allocatedUnits,
                        damagedBoxes,
                        damagedUnits
                    },
                    reorderPoint: {
                        boxes: Math.floor(totalBoxes * 0.2), // Reorder at 20%
                        units: Math.floor(totalUnits * 0.2)
                    },
                    maxCapacity: {
                        boxes: Math.floor(totalBoxes * 2), // Max capacity is 2x current
                        units: Math.floor(totalUnits * 2)
                    },
                    temperatureRange: zone === 'Frozen Storage' ? { min: -10, max: 10 } :
                                   zone === 'Cold Storage' ? { min: 32, max: 40 } :
                                   { min: 60, max: 80 }
                });
            }
        }

        // Insert product locations in batches to avoid memory issues
        const batchSize = 50;
        for (let i = 0; i < productLocations.length; i += batchSize) {
            const batch = productLocations.slice(i, i + batchSize);
            await ProductLocation.insertMany(batch);
            console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(productLocations.length / batchSize)}`);
        }

        console.log(`🎉 Successfully created ${productLocations.length} product locations`);
        console.log('✅ Inventory data seeding completed!');

    } catch (error) {
        console.error('❌ Error seeding inventory data:', error);
    }
};

module.exports = { seedInventoryData };