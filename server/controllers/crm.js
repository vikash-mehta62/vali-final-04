const Contact = require("../models/contact");
const Member = require('../models/Member');

// ✅ Create Contact
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, company, type, status, tags, businessCategory, businessSubcategory, purchaseVolume, preferredDeliveryDay, notes } = req.body;

    // 🛑 Validation
    if (!name || name.length < 3) return res.status(400).json({ success: false, message: "Name must be at least 3 characters long." });
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: "Invalid email format." });
    if (!phone || !/^[0-9]{10}$/.test(phone)) return res.status(400).json({ success: false, message: "Phone number must be 10 digits." });
    if (!company) return res.status(400).json({ success: false, message: "Company is required." });
    if (!["lead", "customer", "partner"].includes(type)) return res.status(400).json({ success: false, message: "Invalid type." });
    if (!["active", "inactive", "new"].includes(status)) return res.status(400).json({ success: false, message: "Invalid status." });

    // ✅ Save to Database
    const contact = new Contact({ name, email, phone, company, type, status, tags, businessCategory, businessSubcategory, purchaseVolume, preferredDeliveryDay, notes });

    await contact.save();
    res.status(201).json({ success: true, message: "Contact created successfully", contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get All Contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Single Contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });

    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Contact
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });

    // ✅ Update valid fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) contact[key] = updateData[key];
    });

    await contact.save();
    res.json({ success: true, message: "Contact updated successfully", contact });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });

    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.createMember = async (req, res) => {
  try {
    const { name, email, phone, role, department, status, assignedTasks } = req.body;
    const newMember = new Member({ name, email, phone, role, department, status, assignedTasks });
    await newMember.save();
    res.status(201).json({ success: true, message: 'Member created successfully', data: newMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json({ success: true, message: 'Members retrieved successfully', data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Member
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member retrieved successfully', data: member });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Member
exports.updateMember = async (req, res) => {
  try {
    const { name, email, phone, role, department, status, assignedTasks } = req.body;
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, department, status, assignedTasks },
      { new: true }
    );
    if (!updatedMember) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member updated successfully', data: updatedMember });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Member
exports.deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);
    if (!deletedMember) return res.status(404).json({ success: false, message: 'Member not found' });
    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};