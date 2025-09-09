const express = require('express');
const {
  getAllCustomersWithAnalytics,
  getCustomerInsights,
  updateCustomer
} = require('../controllers/customerCtrl');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all customers with analytics (admin only)
router.get('/analytics', auth, isAdmin, getAllCustomersWithAnalytics);

// Get specific customer insights
router.get('/:customerId/insights', auth, getCustomerInsights);

// Update customer data
router.put('/:customerId', auth, updateCustomer);

module.exports = router;