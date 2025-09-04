const express = require('express');
const {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} = require('../controllers/vendorCtrl');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/create', createVendor);
router.get('/getAll', getAllVendors);
router.get('/get/:id', auth,getVendorById);
router.put('/update/:id',auth, updateVendor);
router.delete('/delete/:id',auth, deleteVendor);

module.exports = router;
