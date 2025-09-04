const express = require("express");
const router = express.Router();
const priceListTemplateController = require("../controllers/priceListCtrl");

router.post("/create", priceListTemplateController.createPriceListTemplate);
router.get("/getAll", priceListTemplateController.getAllPriceListTemplates);
router.get("/get/:id", priceListTemplateController.getPriceListTemplateById);
router.put("/update/:id", priceListTemplateController.updatePriceListTemplate);
router.delete("/delete/:id", priceListTemplateController.deletePriceListTemplate);

module.exports = router
