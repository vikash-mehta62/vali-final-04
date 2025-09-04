
import { Product, Client, Activity, AiInsight, Reorder, Order } from "../types";

// Sample products
export const products: Product[] = [
  {
    id: "prod-1",
    name: "Organic Apples",
    category: "Fruits",
    quantity: 200,
    unit: "kg",
    price: 2.99,
    threshold: 50,
    description: "Fresh organic apples from local farms",
    bulkDiscounts: [
      { minQuantity: 10, discountPercent: 5 },
      { minQuantity: 20, discountPercent: 10 },
    ],
    origin: "Local Farm",
    organic: true,
    popularityRank: 2,
    lastUpdated: "2023-09-15T08:30:00Z",
  },
  {
    id: "prod-2",
    name: "Bananas",
    category: "Fruits",
    quantity: 150,
    unit: "kg",
    price: 1.49,
    threshold: 30,
    lastUpdated: "2023-10-05",
    description: "Sweet yellow bananas"
  },
  {
    id: "prod-3",
    name: "Carrots",
    category: "Vegetables",
    quantity: 75,
    unit: "kg",
    price: 1.29,
    threshold: 15,
    lastUpdated: "2023-10-10",
    description: "Fresh orange carrots"
  },
  {
    id: "prod-4",
    name: "Premium Beef Steak",
    category: "Meat",
    quantity: 50,
    unit: "kg",
    price: 12.99,
    threshold: 10,
    lastUpdated: "2023-10-15",
    description: "High-quality premium beef steak"
  },
  {
    id: "prod-5",
    name: "Milk",
    category: "Dairy",
    quantity: 100,
    unit: "liter",
    price: 1.99,
    threshold: 25,
    lastUpdated: "2023-10-20",
    description: "Fresh whole milk"
  },
  {
    id: "prod-6",
    name: "Organic Eggs",
    category: "Dairy",
    quantity: 200,
    unit: "dozen",
    price: 3.99,
    threshold: 40,
    lastUpdated: "2023-10-25",
    description: "Free-range organic eggs"
  },
  {
    id: "prod-7",
    name: "Whole Wheat Bread",
    category: "Bakery",
    quantity: 80,
    unit: "loaf",
    price: 2.49,
    threshold: 20,
    lastUpdated: "2023-11-01",
    description: "Freshly baked whole wheat bread"
  },
  {
    id: "prod-8",
    name: "Cheddar Cheese",
    category: "Dairy",
    quantity: 60,
    unit: "kg",
    price: 7.99,
    threshold: 15,
    lastUpdated: "2023-11-05",
    description: "Sharp cheddar cheese"
  }
];

// Sample clients/stores
export const clients: Client[] = [
  {
    id: "client-1",
    name: "Citywide Grocery",
    company: "Citywide Grocery LLC",
    email: "orders@citywidegrocery.com",
    phone: "555-123-4567",
    state: "California",
    status: "active",
    lastOrder: "2023-09-20",
    totalSpent: 12500,
    isShop: true,
    shopStatus: "open",
    category: "A",
    address: "123 Main St",
    city: "San Francisco",
    zipCode: "94105",
    location: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
  {
    id: "client-2",
    name: "Metro Market",
    company: "Metro Market Inc.",
    email: "orders@metromarket.com",
    phone: "555-678-9012",
    state: "New York",
    status: "inactive",
    lastOrder: "2023-09-15",
    totalSpent: 15000,
    isShop: true,
    shopStatus: "closed",
    category: "B",
    address: "456 Elm St",
    city: "New York",
    zipCode: "10001",
    location: {
      lat: 40.7128,
      lng: -74.0060,
    },
  },
  {
    id: "client-3",
    name: "Corner Mart",
    company: "Corner Mart Inc.",
    email: "orders@cornermart.com",
    phone: "555-345-6789",
    state: "California",
    status: "active",
    lastOrder: "2023-09-10",
    totalSpent: 8000,
    isShop: true,
    shopStatus: "open",
    category: "C",
    address: "789 Oak St",
    city: "Los Angeles",
    zipCode: "90001",
    location: {
      lat: 34.0522,
      lng: -118.2437,
    },
  },
  {
    id: "client-4",
    name: "Natural Foods Co-op",
    company: "Natural Foods Co-op Inc.",
    email: "orders@naturalfoodscoop.com",
    phone: "555-987-6543",
    state: "California",
    status: "active",
    lastOrder: "2023-09-05",
    totalSpent: 10000,
    isShop: true,
    shopStatus: "open",
    category: "C", // Changed from "D" to match StoreCategory type
    address: "123 Pine St",
    city: "San Diego",
    zipCode: "92101",
    location: {
      lat: 32.7157,
      lng: -117.1611,
    },
  }
];

// Sample orders
export const orders: Order[] = [
  {
    id: "order-1",
    orderId: "ORD-2023-001",
    date: "2023-09-22",
    store: "client-1",
    clientName: "Citywide Grocery",
    clientId: "client-1",
    items: [
      {
        product: "prod-1",
        name: "Organic Apples",
        quantity: 50,
        price: 2.99,
        discountedPrice: 2.84,
        productId: "prod-1",
        productName: "Organic Apples",
        unitPrice: 2.99
      },
      {
        product: "prod-2",
        name: "Fresh Carrots",
        quantity: 30,
        price: 1.49,
        productId: "prod-2",
        productName: "Fresh Carrots",
        unitPrice: 1.49
      },
    ],
    status: "delivered",
    total: 194.20,
    paymentStatus: "paid",
    subtotal: 180.00
  },
  {
    id: "order-2",
    orderId: "ORD-2023-002",
    date: "2023-09-21",
    store: "client-2",
    clientName: "Metro Market",
    clientId: "client-2",
    items: [
      {
        product: "prod-3",
        name: "Premium Beef Steak",
        quantity: 10,
        price: 12.99,
        productId: "prod-3",
        productName: "Premium Beef Steak",
        unitPrice: 12.99
      },
      {
        product: "prod-4",
        name: "Milk",
        quantity: 20,
        price: 1.99,
        productId: "prod-4",
        productName: "Milk",
        unitPrice: 1.99
      },
      {
        product: "prod-6",
        name: "Organic Eggs",
        quantity: 15,
        price: 3.99,
        productId: "prod-6",
        productName: "Organic Eggs",
        unitPrice: 3.99
      },
    ],
    status: "processing",
    total: 248.65,
    paymentStatus: "pending",
    subtotal: 229.30
  },
  {
    id: "order-3",
    orderId: "ORD-2023-003",
    date: "2023-09-20",
    store: "client-3",
    clientName: "Corner Mart",
    clientId: "client-3",
    items: [
      {
        product: "prod-1",
        name: "Organic Apples",
        quantity: 25,
        price: 2.99,
        discountedPrice: 2.69,
        productId: "prod-1",
        productName: "Organic Apples",
        unitPrice: 2.99
      },
      {
        product: "prod-5",
        name: "Fresh Bread",
        quantity: 15,
        price: 2.49,
        productId: "prod-5",
        productName: "Fresh Bread",
        unitPrice: 2.49
      },
    ],
    status: "shipped",
    total: 111.60,
    paymentStatus: "paid",
    subtotal: 104.30
  },
  {
    id: "order-4",
    orderId: "ORD-2023-004",
    date: "2023-09-19",
    store: "client-4",
    clientName: "Natural Foods Co-op",
    clientId: "client-4",
    items: [
      {
        product: "prod-2",
        name: "Fresh Carrots",
        quantity: 40,
        price: 1.49,
        productId: "prod-2",
        productName: "Fresh Carrots",
        unitPrice: 1.49
      },
      {
        product: "prod-6",
        name: "Organic Eggs",
        quantity: 25,
        price: 3.99,
        productId: "prod-6",
        productName: "Organic Eggs",
        unitPrice: 3.99
      },
    ],
    status: "pending",
    total: 159.35,
    paymentStatus: "pending",
    subtotal: 145.30
  },
];

// Sample activities
export const activities: Activity[] = [
  {
    id: "act-1",
    type: "order",
    description: "New order #ORD-2023-001 received from Citywide Grocery",
    timestamp: "2023-09-22T10:30:00Z",
  },
  {
    id: "act-2",
    type: "inventory",
    description: "Low stock alert for Organic Apples",
    timestamp: "2023-11-09T09:15:00",
  },
  {
    id: "act-3",
    type: "client",
    description: "New client Green Grocers Uptown added",
    timestamp: "2023-11-08T16:45:00",
  }
];

// Sample AI insights
export const aiInsights: AiInsight[] = [
  {
    id: "ins-1",
    type: "inventory",
    title: "Low Stock Alert",
    description: "Organic Apples are projected to reach below threshold in 5 days",
    impact: "high",
  },
  {
    id: "ins-2",
    type: "sales",
    title: "Sales Increase",
    description: "Premium Beef Steak sales have increased by 20% this month.",
    impact: "medium",
  }
];

// Sample reorders
export const reorders: Reorder[] = [
  {
    id: "reord-1",
    productId: "prod-1",
    productName: "Organic Apples",
    quantity: 200,
    status: "pending",
    dateCreated: "2023-09-22",
    expectedDelivery: "2023-09-25",
    supplier: "Local Farm Cooperative",
    expedited: true,
    notes: "Urgently needed due to unexpected high demand",
  },
  {
    id: "reord-2",
    productId: "prod-2",
    productName: "Fresh Carrots",
    quantity: 100,
    status: "ordered", // Changed from "shipped" to match Reorder status type
    dateCreated: "2023-09-18",
    expectedDelivery: "2023-09-20",
    supplier: "Local Farm",
    expedited: false,
    notes: "Delivered on time",
  }
];

// Utility Functions
export const getRecentOrders = () => {
  return orders.slice(0, 5); // Return the 5 most recent orders
};

export const getOrderCountByStatus = () => {
  const statusCounts = {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  orders.forEach((order) => {
    statusCounts[order.status]++;
  });

  return statusCounts;
};

export const getTotalInventoryValue = () => {
  return products.reduce((total, product) => total + product.price * product.quantity, 0);
};

export const getLowStockProducts = () => {
  return products.filter((product) => product.quantity <= (product.threshold || 0));
};

export const getReorders = () => {
  return reorders;
};

export const getClients = () => {
  return clients;
};
