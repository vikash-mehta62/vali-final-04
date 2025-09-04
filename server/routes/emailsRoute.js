const express = require("express");
const router = express.Router();


const { priceListSend, priceListSendMulti } = require("../controllers/emails");



router.post("/price-list", priceListSend)
router.post("/price-list-multi", priceListSendMulti)



module.exports = router
