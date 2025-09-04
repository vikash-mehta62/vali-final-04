// Importing required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/authModel");

const asyncHandler = require("express-async-handler");

// Configuring dotenv to load environment variables from .env file
dotenv.config();

// This function is used as middleware to authenticate user requests
exports.auth = asyncHandler(async (req, res, next) => {
  try {
    // Extracting JWT from request cookies, body or header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    // console.log(token)

    // If JWT is missing, return 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` });
    }

    try {
      // Verifying the JWT using the secret key stored in environment variables
      const decode = await jwt.verify(token, process.env.JWT_SECRET);

      // Storing the decoded JWT payload in the request object for further use
      req.user = decode;
    } catch (error) {
      // console.log(error.name)
      console.log(error);
      // If JWT verification fails, return 401 Unauthorized response
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ success: false, message: "Token expired" });
      }
      return res
        .status(401)
        .json({ success: false, message: "token is invalid" });
    }

    // If JWT is valid, move on to the next middleware or request handler
    next();
  } catch (error) {
    console.log(error);
    // If there is an error during the authentication process, return 401 Unauthorized response
    return res.status(401).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    });
  }
});

exports.adminAuth = asyncHandler(async (req, res, next) => {
  try {
    // Extracting JWT from request cookies, body or header
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token)

    // If JWT is missing, return 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` });
    }

    try {
      // Verifying the JWT using the secret key stored in environment variables
      const decode = await jwt.verify(token, process.env.JWT_SECRET);

      // Storing the decoded JWT payload in the request object for further use
      req.user = decode;
    } catch (error) {
      // console.log(error.name)
      console.log(error);
      // If JWT verification fails, return 401 Unauthorized response
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ success: false, message: "Token expired" });
      }
      return res
        .status(401)
        .json({ success: false, message: "token is invalid" });
    }

    // If JWT is valid, move on to the next middleware or request handler
    next();
  } catch (error) {
    console.log(error);
    // If there is an error during the authentication process, return 401 Unauthorized response
    return res.status(401).json({
      success: false,
      message: `Something Went Wrong While Validating the Token`,
    });
  }
});



exports.isCustomre = asyncHandler(async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email });

    if (userDetails.accountType !== "Customer") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Custmore",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
});
