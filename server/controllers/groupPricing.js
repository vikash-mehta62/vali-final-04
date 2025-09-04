const GroupPricing = require('../models/groupPricing');

// CREATE
exports.createGroupPricing = async (req, res) => {
    try {
        const { name, storeId, product_arrayjson } = req.body;

        console.log(req.body)
        const newGroupPricing = await GroupPricing.create({
            name,
            storeId,
            product_arrayjson
        });

        res.status(201).json({
            success: true,
            message: "Group pricing created successfully",
            data: newGroupPricing
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create group pricing",
            error: error.message
        });
    }
};

// READ ALL
exports.getAllGroupPricing = async (req, res) => {
    try {
        const data = await GroupPricing.find();

        res.status(200).json({
            success: true,
            message: "Fetched all group pricings",
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch group pricings",
            error: error.message
        });
    }
};

// READ ONE
exports.getGroupPricingById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await GroupPricing.findById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: "Group pricing not found" });
        }

        res.status(200).json({
            success: true,
            message: "Fetched group pricing",
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch group pricing",
            error: error.message
        });
    }
};

// UPDATE
exports.updateGroupPricing = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, storeId, product_arrayjson } = req.body;

        const updated = await GroupPricing.findByIdAndUpdate(id, {
            name,
            storeId,
            product_arrayjson
        }, { new: true });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Group pricing not found" });
        }

        res.status(200).json({
            success: true,
            message: "Group pricing updated successfully",
            data: updated
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update group pricing",
            error: error.message
        });
    }
};

// DELETE
exports.deleteGroupPricing = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await GroupPricing.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Group pricing not found" });
        }

        res.status(200).json({
            success: true,
            message: "Group pricing deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete group pricing",
            error: error.message
        });
    }
};
