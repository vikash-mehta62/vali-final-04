const express = require('express');
const router = express.Router();
const controller = require('../controllers/groupPricing');

router.post('/create', controller.createGroupPricing);
router.get('/getAll', controller.getAllGroupPricing);
router.get('/get/:id', controller.getGroupPricingById);
router.put('/update/:id', controller.updateGroupPricing);
router.delete('/delete/:id', controller.deleteGroupPricing);

module.exports = router;
