const express = require("express");
const { createDeal, getAllDeals, updateDeal, deleteDeal } = require("../controllers/dealCrmCtrl");
const router = express.Router();

router.post("/create", createDeal)
router.get("/getAll", getAllDeals)
router.put("/update/:id", updateDeal)
router.delete("/delete/:id", deleteDeal)
// router.get("/get/:id", getOrderForStoreCtrl)




module.exports = router
