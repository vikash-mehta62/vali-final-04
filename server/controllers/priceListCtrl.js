const PriceListTemplate = require("../models/PriceListTemplate");

// ✅ Create a new Price List Template
exports.createPriceListTemplate = async (req, res) => {
  try {
    const { name, description, status, products, emailDistributionGroups, lastSent, emailSubject, emailBody } = req.body;

  
    if (!name || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: "Name and at least one product are required." });
    }

    const newTemplate = new PriceListTemplate({
      name,
      description,
      status,
      products,  // Storing full product objects instead of just IDs
      emailDistributionGroups,
      lastSent,
      emailSubject,
      emailBody
    });

    await newTemplate.save();
    res.status(201).json({ success: true, message: "Template created successfully.", data: newTemplate });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
};

// ✅ Get all Price List Templates
exports.getAllPriceListTemplates = async (req, res) => {
  try {
    const templates = await PriceListTemplate.find();
    res.status(200).json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
};

// ✅ Get a single Price List Template by ID
exports.getPriceListTemplateById = async (req, res) => {
  try {
    const template = await PriceListTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found." });
    }

    res.status(200).json({ success: true, data: template });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
};

// ✅ Update a Price List Template
exports.updatePriceListTemplate = async (req, res) => {
  try {
    const { name, description, status, products, emailDistributionGroups, lastSent, emailSubject, emailBody } = req.body;

    const updatedTemplate = await PriceListTemplate.findByIdAndUpdate(
      req.params.id,
      { name, description, status, products, emailDistributionGroups, lastSent, emailSubject, emailBody },
      { new: true }
    );

    if (!updatedTemplate) {
      return res.status(404).json({ success: false, message: "Template not found." });
    }

    res.status(200).json({ success: true, message: "Template updated successfully.", data: updatedTemplate });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
};

// ✅ Delete a Price List Template
exports.deletePriceListTemplate = async (req, res) => {
  try {
    const deletedTemplate = await PriceListTemplate.findByIdAndDelete(req.params.id);

    if (!deletedTemplate) {
      return res.status(404).json({ success: false, message: "Template not found." });
    }

    res.status(200).json({ success: true, message: "Template deleted successfully." });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
};
