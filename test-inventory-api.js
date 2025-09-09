// Simple test script to check if inventory APIs are working
const BASE_URL = 'http://localhost:8080/api/v1';

// Test function
async function testInventoryAPI() {
    try {
        console.log('🧪 Testing Inventory API endpoints...');
        
        // Test 1: Get all product locations (should return empty initially)
        console.log('\n1. Testing GET /product-location/getAll');
        const response1 = await fetch(`${BASE_URL}/product-location/getAll`, {
            headers: {
                'Authorization': 'Bearer test-token' // You'll need a real token
            }
        });
        console.log('Status:', response1.status);
        if (response1.ok) {
            const data1 = await response1.json();
            console.log('Product Locations:', data1.count || 0);
        }

        // Test 2: Get low stock alerts
        console.log('\n2. Testing GET /product-location/low-stock');
        const response2 = await fetch(`${BASE_URL}/product-location/low-stock`, {
            headers: {
                'Authorization': 'Bearer test-token'
            }
        });
        console.log('Status:', response2.status);
        if (response2.ok) {
            const data2 = await response2.json();
            console.log('Low Stock Alerts:', data2.count || 0);
        }

        // Test 3: Get warehouses
        console.log('\n3. Testing GET /warehouse/getAll');
        const response3 = await fetch(`${BASE_URL}/warehouse/getAll`, {
            headers: {
                'Authorization': 'Bearer test-token'
            }
        });
        console.log('Status:', response3.status);
        if (response3.ok) {
            const data3 = await response3.json();
            console.log('Warehouses:', data3.count || 0);
        }

        console.log('\n✅ API tests completed!');
        
    } catch (error) {
        console.error('❌ Error testing API:', error.message);
    }
}

// Run the test
testInventoryAPI();