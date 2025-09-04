const express = require("express")
const { registerCtrl, loginCtrl, updatePermitionCtrl, addMemberCtrl, getAllMemberCtrl, updateStoreCtrl, getAllStoreCtrl, getUserByEmailCtrl, fetchMyProfile, changePasswordCtrl, deleteStoreIfNoOrders } = require("../controllers/authCtrl")
const { auth } = require("../middleware/auth")
const router = express.Router()


router.post("/login", loginCtrl)
router.post("/register", registerCtrl)
router.post("/member", addMemberCtrl)
router.get("/all-members", getAllMemberCtrl)
router.get("/all-stores", getAllStoreCtrl)
router.post("/user", getUserByEmailCtrl)
router.put("/update/:id", updatePermitionCtrl)
router.put("/update-store/:id", updateStoreCtrl)
router.delete("/delete-store/:id", deleteStoreIfNoOrders)

router.put("/update-password",auth, changePasswordCtrl)
router.get("/fetchMyProfile",auth,fetchMyProfile )



module.exports = router