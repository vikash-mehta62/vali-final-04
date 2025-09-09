const express = require('express');
const router = express.Router();
const {
  createCustomerCtrl,
  getAllCustomersCtrl,
  getSingleCustomerCtrl,
  deleteCustomerCtrl,
  updateCustomerCtrl,
  getCustomerOrdersCtrl,
  getCustomerAnalyticsCtrl,
  bulkUpdateCustomerStatusCtrl,
  searchCustomersCtrl
} = require('../controllers/customerCtrl');

// Basic CRUD Routes
router.post('/create', createCustomerCtrl);
router.get('/all', getAllCustomersCtrl);
router.get('/single/:id', getSingleCustomerCtrl);
router.put('/update/:id', updateCustomerCtrl);
router.delete('/delete/:id', deleteCustomerCtrl);

// Advanced Routes
router.get('/orders/:customerId', getCustomerOrdersCtrl);
router.get('/analytics/:customerId', getCustomerAnalyticsCtrl);
router.put('/bulk-status', bulkUpdateCustomerStatusCtrl);
router.get('/search', searchCustomersCtrl);

module.exports = router;