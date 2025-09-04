const express = require("express");
const { createCategoryCtrl, getAllCategoriesCtrl, deleteCategory, updateCategoryCtrl } = require("../controllers/categoryCrtl");
const router = express.Router();

router.post("/create", createCategoryCtrl)
router.get("/getAll", getAllCategoriesCtrl)
router.delete("/delete/:id", deleteCategory)
router.put("/update/:id", updateCategoryCtrl)



module.exports = router
