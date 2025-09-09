const bcrypt = require("bcryptjs");
const authModel = require("../models/authModel");
const jwt = require("jsonwebtoken");
const Order = require("../models/orderModle");




const registerCtrl = async (req, res) => {
  try {
    const {
      email, phone, storeName, ownerName, address, city, state, zipCode, businessDescription, password, agreeTerms, role = "member", isOrder = false, isProduct = false
    } = req.body;

    if (!email || !password) {
      return res.status(403).send({
        success: false,
        message: "All required fields must be filled",
      });
    }


    const existingUser = await authModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authModel.create({
      email, phone, storeName, ownerName, address, city, state, zipCode, businessDescription, password: hashedPassword, agreeTerms, role, isOrder, isProduct
    });

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options);

    return res.status(200).json({
      success: true,
      token,
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

const loginCtrl = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    const user = await authModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2d" }
      );


      user.token = token;
      user.password = undefined;
      const options = {
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Fix: 2 days instead of 2 seconds
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};



const updatePermitionCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { isOrder, isProduct } = req.body;
    const user = await authModel.findByIdAndUpdate(
      id,
      { isOrder, isProduct },
      { new: true, runValidators: true }
    );



    res.status(200).json({ success: true, message: "Permissions updated successfully", user });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error in updating permission api"
    });
  }
};



const addMemberCtrl = async (req, res) => {
  try {
    const {
      name, email, phone, password, role = "member", isOrder = false, isProduct = false
    } = req.body;
    console.log(req.body)

    if (!email || !password) {
      return res.status(403).send({
        success: false,
        message: "All required fields must be filled",
      });
    }


    const existingUser = await authModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authModel.create({
      name, email, phone, password: hashedPassword, role, isOrder, isProduct
    });



    return res.status(200).json({
      success: true,
      user,
      message: "Member Created  Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in member create api.",
    });
  }
};


const getAllMemberCtrl = async (req, res) => {
  try {
    // Store name ke hisab se ascending order me sort
    const members = await authModel.find().sort({ storeName: 1 });

    return res.status(200).json({
      success: true,
      members
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in getting member API!",
    });
  }
};




const getAllStoreCtrl = async (req, res) => {
  try {
    const stores = await authModel.find({ role: "store" }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      stores
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in getting member API!",
    });
  }
};


const getUserByEmailCtrl = async (req, res) => {
  try {
    const { email, id } = req.body;

    if (!email && !id) {
      return res.status(400).json({
        success: false,
        message: "Email or ID is required",
      });
    }

    let query = { role: "store" };

    if (id) {
      query._id = id;
    } else if (email) {
      query.email = email;
    }

    const user = await authModel.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in getUserByEmailCtrl:", error);
    return res.status(500).json({
      success: false,
      message: "Error in getting user API!",
    });
  }
};


const updateStoreCtrl = async (req, res) => {
  try {
    const {
      storeName,
      ownerName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      businessDescription,
      priceCategory,
      shippingCost

    } = req.body;


    const { id } = req.params;


    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Store ID is required",
      });
    }

    const store = await authModel.findById(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    store.storeName = storeName || store.storeName;
    store.ownerName = ownerName || store.ownerName;
    store.email = email || store.email;
    store.phone = phone || store.phone;
    store.address = address || store.address;
    store.city = city || store.city;
    store.state = state || store.state;
    store.zipCode = zipCode || store.zipCode;
    store.priceCategory = priceCategory || store.priceCategory;
    store.businessDescription = businessDescription || store.businessDescription;
    store.shippingCost = shippingCost || store.shippingCost;

    await store.save();

    return res.status(200).json({
      success: true,
      message: "Store Updated Successfully!",
      store,
    });
  } catch (error) {
    console.error("Error updating store:", error);
    return res.status(500).json({
      success: false,
      message: "Error in updating store API!",
    });
  }
};


const fetchMyProfile = async (req, res) => {
  try {
    // Get email and password from request body
    const id = req.user.id



    // Find user with provided email
    const user = await authModel.findById(id)

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }

    return res.status(200).json({
      user,
      success: true,
      message: `Fetch Data Successfully`,
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: `Error During fetch data`,
    })
  }
}

const changePasswordCtrl = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    console.log(req.body)
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new passwords are required",
      });
    }

    const user = await authModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error in change password:", error);
    return res.status(500).json({
      success: false,
      message: "Error while changing password",
    });
  }
};

const deleteStoreIfNoOrders = async (req, res) => {
  try {
    const storeId = req.params.id;
console.log(storeId)
    // Check if any order is associated with this store
    const ordersCount = await Order.countDocuments({ store: storeId });

    if (ordersCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete store. Orders are associated with this store.",
      });
    }

    // Delete the store
    const deletedStore = await authModel.findByIdAndDelete(storeId);

    if (!deletedStore) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Store deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting store:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting store.",
    });
  }
};


module.exports = {
  registerCtrl,
  loginCtrl,
  getUserByEmailCtrl,
  updatePermitionCtrl,
  addMemberCtrl,
  getAllMemberCtrl,
  updateStoreCtrl,
  getAllStoreCtrl,
  fetchMyProfile,
  changePasswordCtrl,
  deleteStoreIfNoOrders
};
