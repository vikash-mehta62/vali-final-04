const express = require("express");
const { createTask, getAllTasks, updateTask, deleteTask } = require("../controllers/taskCtrl");
const router = express.Router();

router.post("/create", createTask)
router.get("/getAll", getAllTasks)
router.put("/update/:id", updateTask)
router.delete("/delete/:id", deleteTask)
// router.get("/get/:id", getOrderForStoreCtrl)




module.exports = router
