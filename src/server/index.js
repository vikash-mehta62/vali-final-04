const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

// Initialize the database
db.initializeDatabase();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// *** PRODUCTS ROUTES ***
app.get('/api/inventory', (req, res) => {
  try {
    const products = db.productOperations.getAll();
    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

app.get('/api/inventory/:id', (req, res) => {
  try {
    const product = db.productOperations.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

app.post('/api/inventory', (req, res) => {
  try {
    const newProduct = {
      id: req.body.id || `p${uuidv4().substring(0, 3)}`,
      ...req.body,
      lastUpdated: req.body.lastUpdated || new Date().toISOString().split('T')[0]
    };
    
    const product = db.productOperations.create(newProduct);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/inventory/:id', (req, res) => {
  try {
    const product = db.productOperations.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updatedProduct = {
      ...req.body,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    const result = db.productOperations.update(req.params.id, updatedProduct);
    res.json(result);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/inventory/:id', (req, res) => {
  try {
    const product = db.productOperations.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    db.productOperations.delete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.get('/api/inventory/low-stock', (req, res) => {
  try {
    const lowStockProducts = db.productOperations.getLowStock();
    res.json(lowStockProducts);
  } catch (error) {
    console.error('Error getting low stock products:', error);
    res.status(500).json({ error: 'Failed to retrieve low stock products' });
  }
});

// *** CLIENTS ROUTES ***
app.get('/api/clients', (req, res) => {
  try {
    const clients = db.clientOperations.getAll();
    res.json(clients);
  } catch (error) {
    console.error('Error getting clients:', error);
    res.status(500).json({ error: 'Failed to retrieve clients' });
  }
});

app.get('/api/clients/:id', (req, res) => {
  try {
    const client = db.clientOperations.getById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error getting client:', error);
    res.status(500).json({ error: 'Failed to retrieve client' });
  }
});

app.post('/api/clients', (req, res) => {
  try {
    const newClient = {
      id: req.body.id || `c${uuidv4().substring(0, 3)}`,
      ...req.body
    };
    
    const client = db.clientOperations.create(newClient);
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

app.put('/api/clients/:id', (req, res) => {
  try {
    const client = db.clientOperations.getById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    const result = db.clientOperations.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

app.delete('/api/clients/:id', (req, res) => {
  try {
    const client = db.clientOperations.getById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    db.clientOperations.delete(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

app.get('/api/clients/:id/orders', (req, res) => {
  try {
    const orders = db.clientOperations.getClientOrders(req.params.id);
    res.json(orders);
  } catch (error) {
    console.error('Error getting client orders:', error);
    res.status(500).json({ error: 'Failed to retrieve client orders' });
  }
});

// *** STAFF ACTIVITY ROUTES ***
app.get('/api/staff/activities', (req, res) => {
  try {
    // This would normally fetch from a database
    const activities = [
      {
        id: '1',
        staffId: 'staff1',
        staffName: 'John Smith',
        activityType: 'call',
        activityDetail: 'Sales call with Acme Corp',
        timestamp: new Date().toISOString(),
        duration: '18m',
        outcome: 'successful'
      },
      // More activities...
    ];
    res.json(activities);
  } catch (error) {
    console.error('Error getting staff activities:', error);
    res.status(500).json({ error: 'Failed to retrieve staff activities' });
  }
});

app.post('/api/staff/activities', (req, res) => {
  try {
    // This would normally save to a database
    const newActivity = {
      id: uuidv4(),
      ...req.body,
      timestamp: new Date().toISOString()
    };
    res.status(201).json(newActivity);
  } catch (error) {
    console.error('Error creating staff activity:', error);
    res.status(500).json({ error: 'Failed to create staff activity' });
  }
});

// *** ORDERS ROUTES ***
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.orderOperations.getAll();
    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

app.get('/api/orders/:id', (req, res) => {
  try {
    const order = db.orderOperations.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const newOrder = {
      id: req.body.id || `o${uuidv4().substring(0, 3)}`,
      ...req.body,
      date: req.body.date || new Date().toISOString().split('T')[0]
    };
    
    const order = db.orderOperations.create(newOrder);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id', (req, res) => {
  try {
    const order = db.orderOperations.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const result = db.orderOperations.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  try {
    const order = db.orderOperations.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    db.orderOperations.delete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// *** REORDERS ROUTES ***
app.get('/api/reorders', (req, res) => {
  try {
    const status = req.query.status;
    const reorders = status ? 
      db.reorderOperations.getByStatus(status) : 
      db.reorderOperations.getAll();
    
    res.json(reorders);
  } catch (error) {
    console.error('Error getting reorders:', error);
    res.status(500).json({ error: 'Failed to retrieve reorders' });
  }
});

app.post('/api/reorders', (req, res) => {
  try {
    const today = new Date();
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() + (req.body.expedited ? 2 : 5));
    
    const newReorder = {
      id: req.body.id || `r${uuidv4().substring(0, 3)}`,
      ...req.body,
      dateCreated: req.body.dateCreated || today.toISOString().split('T')[0],
      expectedDelivery: req.body.expectedDelivery || expectedDate.toISOString().split('T')[0],
      status: req.body.status || 'pending'
    };
    
    const reorder = db.reorderOperations.create(newReorder);
    res.status(201).json(reorder);
  } catch (error) {
    console.error('Error creating reorder:', error);
    res.status(500).json({ error: 'Failed to create reorder' });
  }
});

app.put('/api/reorders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const result = db.reorderOperations.updateStatus(req.params.id, status);
    if (!result) {
      return res.status(404).json({ error: 'Reorder not found' });
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error updating reorder status:', error);
    res.status(500).json({ error: 'Failed to update reorder status' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
