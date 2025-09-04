const Vendor = require('../models/vendorModel');

// ✅ Create Vendor
const createVendor = async (req, res) => {
  try {
    const {
      name,
      type,
      contactName,
      email,
      phone,
      address,
      notes,
      productsSupplied,
    } = req.body;

    const vendor = new Vendor({
      name,
      type,
      contactName,
      email,
      phone,
      address,
      notes,
      productsSupplied,
    });

    await vendor.save();

    res.status(201).json({
      success: true,
      message: 'Vendor created successfully',
      data: vendor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create vendor',
      error: err.message,
    });
  }
};

// ✅ Get All Vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json({
      success: true,
      message: 'Vendors fetched successfully',
      data: vendors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendors',
      error: err.message,
    });
  }
};

// ✅ Get Vendor by ID
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Vendor fetched successfully',
      data: vendor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor',
      error: err.message,
    });
  }
};

// ✅ Update Vendor
const updateVendor = async (req, res) => {
  try {
    const {
      name,
      type,
      contactName,
      email,
      phone,
      address,
      notes,
      productsSupplied,
    } = req.body;

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      {
        name,
        type,
        contactName,
        email,
        phone,
        address,
        notes,
        productsSupplied,
      },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor updated successfully',
      data: updatedVendor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update vendor',
      error: err.message,
    });
  }
};

// ✅ Delete Vendor
const deleteVendor = async (req, res) => {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!deletedVendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vendor deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete vendor',
      error: err.message,
    });
  }
};

module.exports = {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};
