const express = require("express");
const creditMemoCtrl = require("../controllers/creditMemosCtrl");

const router = express.Router();

router.post("/create", creditMemoCtrl.createCreditMemo);
router.get("/", creditMemoCtrl.getCreditMemos);
router.get("/:id", creditMemoCtrl.getCreditMemoById);
router.put("/:id", creditMemoCtrl.updateCreditMemo);
router.delete("/:id", creditMemoCtrl.deleteCreditMemo);
router.get("/by-order/:orderId", creditMemoCtrl.getCreditMemosByOrderId);
router.put("/update/:creditMemoId", creditMemoCtrl.updateCreditMemo);

module.exports = router;
