const express = require("express");
const router = express.Router();
const { auth, } = require("../middleware/auth");
const { 
    createOrderCtrl, 
    getAllOrderCtrl, 
    getOrderForStoreCtrl, 
    updateOrderCtrl, 
    updatePalletInfo, 
    userDetailsWithOrder, 
    updatePaymentDetails, 
    deleteOrderCtrl,     
    updateOrderTypeCtrl, 
    getUserOrderStatement, 
    updateShippingController, 
    getDashboardData, 
    getPendingOrders,
    invoiceMailCtrl,
    markOrderAsUnpaid,
    deleteOrderHardCtrl

} = require("../controllers/orderCtrl");

router.post("/create", auth, createOrderCtrl)
router.get("/getAll", auth,  getAllOrderCtrl)
router.get("/get/:id", auth, getOrderForStoreCtrl)
router.delete("/delete/:id", auth, deleteOrderCtrl)
router.delete("/hard-delete/:id", auth, deleteOrderHardCtrl)
router.put("/update/:id", auth, updateOrderCtrl)
router.put("/update-plate/:orderId", auth, updatePalletInfo)
router.get("/user/:userId",  userDetailsWithOrder)
router.put("/payment-update/:orderId",  updatePaymentDetails)
router.put("/unpaid/:orderId",  markOrderAsUnpaid)
router.put("/update-otype/:orderId",  updateOrderTypeCtrl)
router.get("/statement/:userId",  getUserOrderStatement)

router.post("/update-shipping", updateShippingController);
router.get("/dashboard", getDashboardData);
router.get("/pending", getPendingOrders);
router.post("/invoiceMail/:id", invoiceMailCtrl);



module.exports = router
