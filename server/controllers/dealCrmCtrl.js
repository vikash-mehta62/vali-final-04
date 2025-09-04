const Deal = require("../models/DealCrmModel");
const mongoose = require("mongoose")
// ✅ Create Deal
exports.createDeal = async (req, res) => {
    try {
        const { title, company, value, stage, contactName, closeDate, probability, contactEmail, notes } = req.body;

        // 🛑 Validation
        if (!title || title.length < 3) return res.status(400).json({ success: false, message: "Title must be at least 3 characters long." });
        if (!company) return res.status(400).json({ success: false, message: "Company is required." });
        if (!value || isNaN(value) || value < 0) return res.status(400).json({ success: false, message: "Invalid deal value." });
        if (!stage) return res.status(400).json({ success: false, message: "Stage is required." });
        if (!contactName) return res.status(400).json({ success: false, message: "Contact Name is required." });
        if (!closeDate || isNaN(Date.parse(closeDate))) return res.status(400).json({ success: false, message: "Invalid close date." });
        if (probability < 0 || probability > 100) return res.status(400).json({ success: false, message: "Probability must be between 0 and 100." });
        if (!contactEmail || !/^\S+@\S+\.\S+$/.test(contactEmail)) return res.status(400).json({ success: false, message: "Invalid email format." });

        // ✅ Save to Database
        const deal = new Deal({ title, company, value, stage, contactName, closeDate, probability, contactEmail, notes });
        await deal.save();
        res.status(201).json({ success: true, message: "Deal created successfully", deal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get All Deals
exports.getAllDeals = async (req, res) => {
    try {
        const deals = await Deal.find();
        res.json({ success: true, deals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get Single Deal by ID
exports.getDealById = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) return res.status(404).json({ success: false, message: "Deal not found" });

        res.json({ success: true, deal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;


        const deal = await Deal.findById(id);
        if (!deal) {
            return res.status(404).json({ success: false, message: "Deal not found" });
        }

        // ✅ Update valid fields
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] !== undefined) deal[key] = updateData[key];
        });

        await deal.save();
        res.json({ success: true, message: "Deal updated successfully", deal });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}





// ✅ Delete Deal
exports.deleteDeal = async (req, res) => {
    try {
        const { id } = req.params;
        const deal = await Deal.findByIdAndDelete(id);

        if (!deal) return res.status(404).json({ success: false, message: "Deal not found" });

        res.json({ success: true, message: "Deal deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
