const express = require("express");
const { createContact, 
    getAllContacts, 
    updateContact, 
    deleteContact, 
    createMember ,
    getAllMembers,
    deleteMember,
    getContactById,
    getMemberById,
    updateMember

} = require("../controllers/crm");
const router = express.Router();


// /Contact
router.post("/create", createContact)
router.get("/getAll", getAllContacts)
router.put("/update/:id", updateContact)
router.delete("/delete/:id", deleteContact)
// router.get("/get/:id", getOrderForStoreCtrl)


// TEAM
router.post('/member-create', createMember);
router.get('/member-getAll', getAllMembers);
router.put('/member-update/:id', updateMember);
router.delete('/member-delete/:id', deleteMember);
router.get('/member-get-id/:id', getMemberById);



module.exports = router
