const orderModel = require("../models/orderModle");
const mongoose = require("mongoose");
const authModel = require("../models/authModel"); // Ensure the correct path for your Auth model
const { generateStatementPDF } = require("../utils/generateOrder");
const nodemailer = require("nodemailer");
const { exportInvoiceToPDFBackend } = require("../templates/exportInvoice");
const Counter = require("../models/counterModel");
const Product = require("../models/productModel");

const mailSender = async (
  to,
  subject,
  text,
  pdfBase64,
  filename = "Customer_Statement.pdf"
) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false,
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to,
      subject,
      text,
      attachments: [
        {
          filename: filename,
          content: Buffer.from(pdfBase64, "base64"),
          contentType: "application/pdf",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Email sending failed:", err);
  }
};

const getNextOrderNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "order" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = String(counter.seq).padStart(5, "0"); // 00101, 00102...
  return `N-${paddedSeq}`;
};

const createOrderCtrl = async (req, res) => {
  try {
    const {
      items,
      status,
      total,
      clientId,
      billingAddress,
      shippingAddress,
      orderType = "Regural",
      orderNumber,
      createdAt,
    } = req.body;

    console.log(createdAt);

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!status) {
      return res.status(400).json({ message: "Order status is required" });
    }
    if (!total || total <= 0) {
      return res
        .status(400)
        .json({ message: "Total amount must be greater than zero" });
    }

    const generateOrderNumber = () => {
      const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
      return `${randomNumber}`;
    };

    const user = await authModel
      .findById(clientId.value)
      .select("shippingCost");

    const shippinCost = user.shippingCost;

    // More robust date handling for VPS deployment
    let orderDate;
    if (createdAt) {
      // If a specific date was provided, use it directly as an ISO string
      // This bypasses timezone issues by storing the exact string representation
      if (typeof createdAt === "string") {
        // If it's already a string (like from a date picker), parse it
        const dateObj = new Date(createdAt);
        // Force the date to be interpreted as is, without timezone adjustment
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const day = dateObj.getDate();

        // Create date at noon to avoid any day boundary issues
        orderDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
      } else {
        // If it's already a Date object
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth();
        const day = createdAt.getDate();

        orderDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
      }
    } else {
      // If no date provided, use current date (today)
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();

      // orderDate = new Date(Date.UTC(year, month, day, 12, 0, 0));
      orderDate = new Date();
    }

    const newOrder = new orderModel({
      orderNumber: orderNumber ? orderNumber : await getNextOrderNumber(),
      items,
      store: clientId.value,
      status,
      shippingAddress,
      billingAddress,
      total: total + shippinCost,
      orderType,
      shippinCost,
      createdAt: createdAt, // Use the fixed date
    });

    for (const item of items) {
      const { productId, quantity, pricingType } = item;
      if (!productId || quantity <= 0) continue;

      const product = await Product.findById(productId);
      if (!product) {
        console.warn(`❌ Product not found: ${productId}`);
        continue;
      }

      const saleDate = orderDate || new Date();

      console.log(`📦 Processing Product: ${product.name}`);
      console.log(`➡ Pricing Type: ${pricingType}`);
      console.log(`➡ Quantity Ordered: ${quantity}`);
      console.log(`➡ unitPurchase: ${product.unitPurchase}`);
      console.log(`➡ totalPurchase (Boxes): ${product.totalPurchase}`);
      console.log(`➡ unitRemaining (Before): ${product.unitRemaining}`);
      console.log(`➡ totalSell (Before): ${product.totalSell}`);
      console.log(`➡ remaining (Boxes Left Before): ${product.remaining}`);

      // UNIT ORDER
      if (pricingType === "unit") {
        product.lbSellHistory.push({
          date: saleDate,
          weight: quantity,
          lb: "unit",
        });

        product.unitSell += quantity;
        product.unitRemaining = Math.max(0, product.unitRemaining - quantity);

        console.log(`✅ UNIT Order Processed`);
        console.log(`➡ unitSell (After): ${product.unitSell}`);
        console.log(`➡ unitRemaining (After): ${product.unitRemaining}`);
      }

      // BOX ORDER
      else if (pricingType === "box") {
        const totalBoxes = product.totalPurchase || 0;
        const totalUnits = product.unitPurchase || 0;
        const lastUpdated =
          product.updatedFromOrders?.[product.updatedFromOrders.length - 1];

        // const avgUnitsPerBox = totalBoxes > 0 ? totalUnits / totalBoxes : 0;
        // const estimatedUnitsUsed = avgUnitsPerBox * quantity;

        let avgUnitsPerBox = 0;
        let estimatedUnitsUsed = 0;

        if (lastUpdated && lastUpdated.perLb && lastUpdated.newQuantity) {
          avgUnitsPerBox = lastUpdated.perLb; // perLb is already unit/box
          estimatedUnitsUsed = avgUnitsPerBox * quantity;
        }
        console.log(`🧮 Calculated avgUnitsPerBox: ${avgUnitsPerBox}`);
        console.log(
          `📉 Estimated Units Used from Boxes: ${estimatedUnitsUsed}`
        );

        product.lbSellHistory.push({
          date: saleDate,
          weight: estimatedUnitsUsed,
          lb: "box",
        });

        product.salesHistory.push({
          date: saleDate,
          quantity: quantity,
        });

        product.totalSell += quantity;
        product.remaining = Math.max(0, product.remaining - quantity);
        product.unitRemaining = Math.max(
          0,
          product.unitRemaining - estimatedUnitsUsed
        );
        product.unitSell = Math.max(estimatedUnitsUsed);

        console.log(`✅ BOX Order Processed`);
        console.log(`➡ totalSell (After): ${product.totalSell}`);
        console.log(`➡ remaining (Boxes Left After): ${product.remaining}`);
        console.log(`➡ unitRemaining (After): ${product.unitRemaining}`);
      }

      await product.save();
      console.log(
        `💾 Product saved: ${product.name}\n------------------------`
      );
    }

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllOrderCtrl = async (req, res) => {
  try {
    const user = req.user;
    const search = req.query.search || "";
    const orderType = req.query.orderType || "";
    const paymentStatus = req.query.paymentStatus || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const matchStage = {};

    // Filter by user role
    if (user.role === "store") {
      matchStage.store = mongoose.Types.ObjectId(user.id);
    }

    if (paymentStatus !== "all") {
      matchStage.paymentStatus = paymentStatus;
    }

    if (orderType && orderType !== "Regural") {
      matchStage.orderType = orderType;
    } else if (orderType === "Regural") {
      matchStage.$or = [
        { orderType: "Regural" },
        { orderType: { $exists: false } },
      ];
    }

    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate + "T23:59:59.999Z");
      }
    }

    const searchRegex = new RegExp(search, "i");

    const aggregateQuery = [
      {
        $lookup: {
          from: "auths",
          localField: "store",
          foreignField: "_id",
          as: "store",
        },
      },
      { $unwind: "$store" },
      {
        $match: {
          ...matchStage,
          ...(search
            ? {
                $or: [
                  { orderNumber: searchRegex },
                  { "store.storeName": searchRegex },
                ],
              }
            : {}),
        },
      },
      { $sort: { createdAt: -1, orderNumber: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
          summary: [
            { $match: { isDelete: { $ne: true } } },
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                totalAmount: { $sum: "$total" },
                totalReceived: {
                  $sum: {
                    $cond: [
                      { $eq: ["$paymentStatus", "paid"] },
                      "$total",
                      {
                        $cond: [
                          { $eq: ["$paymentStatus", "partial"] },
                          { $toDouble: { $ifNull: ["$paymentAmount", 0] } },
                          0,
                        ],
                      },
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalOrders: 1,
                totalAmount: 1,
                totalReceived: 1,
                totalPending: { $subtract: ["$totalAmount", "$totalReceived"] },
              },
            },
          ],
        },
      },
    ];

    const result = await orderModel.aggregate(aggregateQuery);

    const orders = result[0].data;
    const totalOrders = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalOrders / limit);

    const summary = result[0].summary[0] || {
      totalOrders: 0,
      totalAmount: 0,
      totalReceived: 0,
      totalPending: 0,
    };

    return res.status(200).json({
      success: true,
      message: orders.length
        ? "Orders fetched successfully!"
        : "No orders found!",
      orders,
      totalOrders,
      totalPages,
      currentPage: page,
      summary,
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "Error fetching orders!",
      error: error.message,
    });
  }
};

const getOrderForStoreCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findById(id);
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in getting  order API!",
    });
  }
};

// const updateOrderCtrl = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateFields = req.body;

//     // Ensure the order exists
//     const existingOrder = await orderModel.findById(id);

//     if (!existingOrder) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found!" });
//     }

//     const oldItemsMap = {};
//     existingOrder.items.forEach(item => {
//       oldItemsMap[item.productId.toString()] = item.quantity;
//     });

//     // Update order fields
//     Object.keys(updateFields).forEach((key) => {
//       if (updateFields[key] !== undefined) {
//         existingOrder[key] = updateFields[key];
//       }
//     });

//     await existingOrder.save();

//     // Now adjust product stocks based on quantity difference
//     for (const newItem of existingOrder.items) {
//       const productId = newItem.productId;
//       const newQty = newItem.quantity;
//       const oldQty = oldItemsMap[productId.toString()] || 0;
//       const diff = newQty - oldQty;

//       if (diff !== 0) {
//         await Product.findByIdAndUpdate(productId, {
//           $inc: {
//             totalSell: diff,
//             quantity: -diff
//           }
//         });
//       }
//     }

//     // Update only the fields that are present in the request body
//     Object.keys(updateFields).forEach((key) => {
//       if (updateFields[key] !== undefined) {
//         existingOrder[key] = updateFields[key];
//       }
//     });

//     await existingOrder.save();

//     return res.status(200).json({
//       success: true,
//       message: "Order updated successfully",
//       updatedOrder: existingOrder,
//     });
//   } catch (error) {
//     console.error("Error updating order:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error while updating order",
//     });
//   }
// };

// POST /api/orders/:orderId/pallet



const resetAndRebuildHistoryForSingleProduct = async (productId, from, to) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const fromDate = new Date(from || "2025-06-30T00:00:00.000Z");
    const toDate = new Date(to || "2030-06-22T23:59:59.999Z");

    // Step 1: Find product
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Step 2: Reset product history
    product.lbSellHistory = [];
    product.salesHistory = [];
    product.unitSell = 0;
    product.totalSell = 0;
    product.unitRemaining = product.unitPurchase;
    product.remaining = product.totalPurchase;
    await product.save();

    // Step 3: Get relevant orders
    const orders = await orderModel.find({
      createdAt: { $gte: fromDate, $lte: toDate },
      'items.productId': productId,
    });

    // Step 4: Rebuild product history
    for (const order of orders) {
      const saleDate = order.createdAt;

      for (const item of order.items) {
        if (!item.productId || item.productId.toString() !== productId) continue;

        const { quantity, pricingType } = item;
        if (quantity <= 0) continue;

        if (pricingType === "unit") {
          product.lbSellHistory.push({ date: saleDate, weight: quantity, lb: "unit" });
          product.unitSell += quantity;
          product.unitRemaining = Math.max(0, product.unitRemaining - quantity);
        }

        if (pricingType === "box") {
          const avgUnitsPerBox = (product.totalPurchase || 0) / (product.totalPurchase > 0 ? product.totalPurchase / (product.unitPurchase || 1) : 1);
          const estimatedUnitsUsed = avgUnitsPerBox * quantity;

          product.lbSellHistory.push({ date: saleDate, weight: estimatedUnitsUsed, lb: "box" });
          product.salesHistory.push({ date: saleDate, quantity });

          product.totalSell += quantity;
          product.remaining = Math.max(0, product.remaining - quantity);
          product.unitRemaining = Math.max(0, product.unitRemaining - estimatedUnitsUsed);
        }
      }
    }

    await product.save();
    return { success: true, message: `History reset and rebuilt for product: ${product.name}` };

  } catch (err) {
    return { success: false, error: err.message };
  }
};



const updateOrderCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const existingOrder = await orderModel.findById(id);
    if (!existingOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found!" });
    }

    const oldItemsMap = {};
    existingOrder.items.forEach((item) => {
      
      oldItemsMap[item.productId.toString()] = {
        quantity: item.quantity,
        pricingType: item.pricingType,
      };
    });

    // Update order fields (excluding items)
    Object.keys(updateFields).forEach((key) => {
      if (key !== "items" && updateFields[key] !== undefined) {
        existingOrder[key] = updateFields[key];
      }
    });

    // If items are updated, process inventory changes
    if (updateFields.items && Array.isArray(updateFields.items)) {
      existingOrder.items = updateFields.items;

      for (const item of updateFields.items) {
        const { productId, quantity, pricingType } = item;
        // if (!productId || quantity <= 0) continue;


        // const product = await Product.findById(productId);
        // if (!product) continue;
        // const saleDate = existingOrder.createdAt || new Date();

        // // Remove old sales history for this date
        // const orderDateISO = new Date(existingOrder.createdAt).toISOString();

        // // Remove only matching entries (pricingType-wise)
        // product.salesHistory = product.salesHistory.filter(
        //   (p) =>
        //     !(
        //       new Date(p.date).toISOString() === orderDateISO &&
        //       oldItemsMap[product._id]?.pricingType === "box"
        //     )
        // );

        // product.lbSellHistory = product.lbSellHistory.filter(
        //   (p) =>
        //     !(
        //       new Date(p.date).toISOString() === orderDateISO &&
        //       p.lb === oldItemsMap[product._id]?.pricingType
        //     )
        // );

        // // Add updated sales history
        // if (pricingType === "unit") {
        //   product.salesHistory.push({
        //     date: saleDate,
        //     quantity: quantity,
        //   });

        //   product.lbSellHistory.push({
        //     date: saleDate,
        //     weight: quantity,
        //     lb: "unit",
        //   });
        // } else if (pricingType === "box") {
        //   const totalBoxes = product.totalPurchase || 1;
        //   const avgUnitsPerBox = product.unitPurchase / totalBoxes;
        //   const estimatedUnitsUsed = avgUnitsPerBox * quantity;

        //   product.salesHistory.push({
        //     date: saleDate,
        //     quantity: quantity,
        //   });

        //   product.lbSellHistory.push({
        //     date: saleDate,
        //     weight: estimatedUnitsUsed,
        //     lb: "box",
        //   });
        // }

        // const old = oldItemsMap[productId.toString()] || {
        //   quantity: 0,
        //   pricingType,
        // };

        // // Reverse old impact
        // if (old.pricingType === "unit") {
        //   product.unitSell -= old.quantity;
        //   product.unitRemaining += old.quantity;
        // } else if (old.pricingType === "box") {
        //   product.totalSell -= old.quantity;
        //   product.remaining += old.quantity;

        //   const totalBoxes = product.totalPurchase || 1;
        //   const avgUnitsPerBox = product.unitPurchase / totalBoxes;
        //   product.unitRemaining += avgUnitsPerBox * old.quantity;
        // }

        // // Apply new impact
        // if (pricingType === "unit") {
        //   product.unitSell += quantity;
        //   product.unitRemaining = Math.max(0, product.unitRemaining - quantity);
        // } else if (pricingType === "box") {
        //   product.totalSell += quantity;
        //   product.remaining = Math.max(0, product.remaining - quantity);

        //   const totalBoxes = product.totalPurchase || 1;
        //   const avgUnitsPerBox = product.unitPurchase / totalBoxes;
        //   const estimatedUnitsUsed = avgUnitsPerBox * quantity;
        //   product.unitRemaining = Math.max(
        //     0,
        //     product.unitRemaining - estimatedUnitsUsed
        //   );
        // }

        // await product.save();


      }
    }

    await existingOrder.save();



for (const item of existingOrder.items) {
  try {
    if (!item.productId) {
      console.warn("⚠️ Skipping item without productId:", item);
      continue;
    }

    console.log(`🔁 Rebuilding product history for: ${item.productId}`);
    const result = await resetAndRebuildHistoryForSingleProduct(item.productId);

    if (result.success) {
      console.log(`✅ Success: ${result.message}`);
    } else {
      console.error(`❌ Failed to rebuild for product ${item.productId}:`, result.error);
    }
  } catch (err) {
    console.error(`🔥 Error processing item ${item.productId}:`, err.message);
  }
}



    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      updatedOrder: existingOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while updating order",
    });
  }
};

const updatePalletInfo = async (req, res) => {
  const { orderId } = req.params;
  const { palletData } = req.body;
  console.log(req.body);
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { palletData },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Pallet info saved successfully",
      data: updatedOrder,
    });
  } catch (err) {
    console.error("Failed to save pallet info:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while saving pallet info",
      error: err.message,
    });
  }
};

const userDetailsWithOrder = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await authModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "orders",
          let: { storeId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$store", "$$storeId"] } } },
            { $sort: { createdAt: -1 } },
          ],
          as: "orders",
        },
      },
      {
        $addFields: {
          totalOrders: { $size: "$orders" },
          totalSpent: {
            $sum: {
              $map: {
                input: "$orders",
                as: "order",
                in: "$$order.total",
              },
            },
          },
          totalPay: {
            $sum: {
              $map: {
                input: "$orders",
                as: "order",
                in: {
                  $cond: [
                    { $eq: ["$$order.paymentStatus", "paid"] },
                    "$$order.total",
                    {
                      $cond: [
                        { $eq: ["$$order.paymentStatus", "partial"] },
                        { $toDouble: "$$order.paymentAmount" },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
          balanceDue: {
            $sum: {
              $map: {
                input: "$orders",
                as: "order",
                in: {
                  $cond: [
                    { $eq: ["$$order.paymentStatus", "paid"] },
                    0,
                    {
                      $subtract: [
                        { $toDouble: "$$order.total" },
                        {
                          $cond: [
                            { $eq: ["$$order.paymentStatus", "partial"] },
                            { $toDouble: "$$order.paymentAmount" },
                            0,
                          ],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalOrders: 1,
          totalSpent: 1,
          totalPay: 1,
          balanceDue: 1,
          orders: 1,
          user: {
            _id: "$_id",
            email: "$email",
            phone: "$phone",
            storeName: "$storeName",
            ownerName: "$ownerName",
            address: "$address",
            city: "$city",
            state: "$state",
            zipCode: "$zipCode",
            businessDescription: "$businessDescription",
            role: "$role",
            createdAt: {
              $dateToString: {
                format: "%Y-%m-%dT%H:%M:%S.%LZ",
                date: "$createdAt",
              },
            },
          },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "User details with order summary fetched successfully",
        data: result[0],
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error("Error fetching user order details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message,
    });
  }
};

const updatePaymentDetails = async (req, res) => {
  const { orderId } = req.params;
  const { method, transactionId, notes, paymentType, amountPaid } = req.body;

  console.log(req.body);

  try {
    // Check for valid method
    if (!["cash", "creditcard", "cheque"].includes(method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method. Allowed: 'cash' or 'creditcard'",
      });
    }

    // Validate based on method
    if (method === "creditcard" && !transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required for credit card payments",
      });
    }

    if (method === "cash" && !notes) {
      return res.status(400).json({
        success: false,
        message: "Notes are required for cash payments",
      });
    }

    // Prepare paymentDetails object
    const paymentDetails = {
      method,
      ...(method === "creditcard" ? { transactionId } : {}),
      ...(method === "cash" ? { notes } : {}),
      ...(method === "cheque" ? { notes } : {}),
      paymentDate: new Date(), // Yaha backend me hi current date daal do
    };

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        paymentDetails,
        paymentStatus: paymentType === "full" ? "paid" : "partial",
        paymentAmount: amountPaid,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment details updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating payment details:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const markOrderAsUnpaid = async (req, res) => {
  const { orderId } = req.params;
  console.log(orderId);
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "pending",
        paymentDetails: null,
        paymentAmount: 0,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order marked as unpaid successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error marking order as unpaid:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteOrderCtrl = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res
      .status(400)
      .json({ success: false, message: "Reason is required" });
  }

  try {
    const order = await orderModel.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const amount = order.total ?? 0;

    // Soft delete flags
    order.isDelete = true;
    order.deleted = { reason, amount };
    order.total = 0;

    // Loop through each item and reverse its effect
    for (const item of order.items) {
      const { productId, quantity, pricingType } = item;
      if (!productId || quantity <= 0) continue;

      const product = await Product.findById(productId);
      if (!product) continue;

      const saleDate = order.createdAt;
      const totalBoxes = product.totalPurchase || 1;
      const avgUnitsPerBox = product.unitPurchase / totalBoxes;
      const estimatedUnitsUsed = avgUnitsPerBox * quantity;

      if (pricingType === "unit") {
        product.unitSell -= quantity;
        product.unitRemaining += quantity;

        // Remove unit lbSellHistory
        // product.lbSellHistory = product.lbSellHistory.filter(
        //   (p) => !(p.date.toISOString() === saleDate.toISOString() && p.lb === "unit" && p.weight === quantity)
        // );

        product.lbSellHistory.push({
          date: Date.now(),
          weight: -Math.abs(quantity),
          lb: "unit",
        });

        // Remove estimated box lbSellHistory
        // product.lbSellHistory = product.lbSellHistory.filter(
        //   (p) => !(p.date.toISOString() === saleDate.toISOString() && p.lb === "box" && p.weight === estimatedUnitsUsed)
        // );
      }

      if (pricingType === "box") {
        product.totalSell -= quantity;
        product.remaining += quantity;
        product.unitRemaining += estimatedUnitsUsed;

        // Remove box sales history
        // product.salesHistory = product.salesHistory.filter(
        //   (p) => !(p.date.toISOString() === saleDate.toISOString() && p.quantity === quantity)
        // );
        product.salesHistory.push({
          date: new Date(),
          quantity: -Math.abs(quantity), // ensure negative value
        });
        product.lbSellHistory.push({
          date: Date.now(),
          weight: -Math.abs(estimatedUnitsUsed),
          lb: "box",
        });
      }

      await product.save();
    }

    // Zero out order items and preserve deleted info
    order.items = order.items.map((item) => {
      const qty = item.quantity ?? 0;
      const price = item.unitPrice || item.price || 0;
      const total = item.total ?? qty * price;

      return {
        ...item,
        deletedQuantity: qty,
        deletedTotal: total,
        quantity: 0,
        total: 0,
      };
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order soft-deleted successfully",
      deletedOrder: order,
    });
  } catch (err) {
    console.error("Soft delete error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteOrderHardCtrl = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!order.isDelete) {
      return res.status(400).json({
        success: false,
        message: "Only soft-deleted orders can be permanently deleted",
      });
    }

    await orderModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order permanently deleted",
    });
  } catch (error) {
    console.error("❌ Hard delete error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting order",
    });
  }
};

const updateOrderTypeCtrl = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderType } = req.body;

    // Check if orderId is valid
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Order ID" });
    }

    // Validate orderType
    if (!orderType || typeof orderType !== "string") {
      return res.status(400).json({
        success: false,
        message: "orderType is required and must be a string",
      });
    }

    // Find and update the order
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { orderType },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order type updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating orderType:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getUserOrderStatement = async (req, res) => {
  try {
    const userId = req.params.userId || req.query.userId;
    const paymentStatus = req.query.paymentStatus || "all";
    const startMonth = req.query.startMonth;
    const endMonth = req.query.endMonth;
    const sendMail = req.query.send;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Fetch user details
    const user = await authModel
      .findById(userId)
      .select(
        "name storeName ownerName phone email address city state zipCode"
      );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Building query for orders
    // Building query for orders
    const query = { store: userId };
    if (paymentStatus !== "all") {
      if (paymentStatus === "pending") {
        query.paymentStatus = { $in: ["pending", "partial"] };
      } else {
        query.paymentStatus = paymentStatus;
      }
    }

    // Date range query
    if (startMonth || endMonth) {
      query.createdAt = {};
      if (startMonth) {
        const [year, month] = startMonth.split("-");
        query.createdAt.$gte = new Date(`${year}-${month}-01`);
      }
      if (endMonth) {
        const [year, month] = endMonth.split("-");
        const endDate = new Date(year, Number(month), 0);
        query.createdAt.$lte = endDate;
      }
    }

    // Fetch orders based on the query
    const orders = await orderModel.find(query).sort({ createdAt: 1 });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found with applied filters",
      });
    }

    // Generate summary and calculate totals
    const summary = {};
    let totalPaid = 0,
      totalPending = 0,
      totalProductsOrdered = 0;
    let allTotalAmount = 0;

    orders.forEach((order) => {
      const created = new Date(order.createdAt);
      const year = created.getFullYear();
      const month = (created.getMonth() + 1).toString().padStart(2, "0");
      const monthKey = `${year}-${month}`;

      if (!summary[monthKey]) {
        summary[monthKey] = {
          orders: [],
          totalAmount: 0,
          totalPaid: 0,
          totalPending: 0,
          totalProducts: 0,
        };
      }

      const itemCount = Array.isArray(order.items)
        ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
        : 0;

      // Determine the payment amount based on the status
      let paymentAmount = 0;
      if (order.paymentStatus === "paid") {
        paymentAmount = order.total; // If paid, the total amount is the payment amount
      } else if (order.paymentStatus === "partial") {
        paymentAmount = order.paymentAmount || 0; // Use the payment amount if partial
      }

      summary[monthKey].orders.push({
        orderNumber: order.orderNumber,
        date: created.toISOString(),
        amount: order.total,
        paymentStatus: order.paymentStatus,
        paymentAmount: paymentAmount, // Use the calculated payment amount
        productCount: itemCount,
      });

      // Calculate paid and balance directly from paymentAmount
      const totalAmount = parseFloat(order.total) || 0;
      const paid = parseFloat(order.paymentAmount) || 0;
      const pending = totalAmount - paid;

      summary[monthKey].totalAmount += totalAmount;
      summary[monthKey].totalPaid += paid;
      summary[monthKey].totalPending += pending;
      summary[monthKey].totalProducts += itemCount;
      allTotalAmount += totalAmount;
      totalPaid += paid;
      totalPending += pending;
      totalProductsOrdered += itemCount;
    });

    // Send mail if required
    if (sendMail == 1) {
      try {
        console.log("Sending statement via email...");

        const responsePDF = await generateStatementPDF({
          user: {
            name: user.ownerName || user.name,
            storeName: user.storeName,
            phone: user.phone,
            email: user.email,
            address: user.address,
            city: user.city,
            state: user.state,
            zipCode: user.zipCode,
          },
          filters: {
            paymentStatus,
            startMonth: startMonth || "all",
            endMonth: endMonth || "all",
          },
          summaryByMonth: summary,
          totalPaid,
          totalPending,
          totalProductsOrdered,
          closingBalance: totalPending,
        });

        // const customerEmail = "vikasmaheshwari6267@gmail.com" ;
        const customerEmail = user.email;
        const subject = `Monthly Statement for ${
          user.storeName
        } - ${new Date().toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })}`;
        const message = `
          Dear ${user.ownerName || user.name},

          Please find attached the monthly statement for your store "${
            user.storeName
          }".
          This statement includes order details and payment status for the selected period.

          Total Amount: ${allTotalAmount}
          Total Paid: ${totalPaid}
          Total Pending: ${totalPending}
          Total Products Ordered: ${totalProductsOrdered}

          If you have any questions or need further assistance, please reach out to us.

          Best Regards,
          Vali Produce
        `;

        await mailSender(customerEmail, subject, message, responsePDF);
        console.log("Email sent successfully to:", customerEmail);
      } catch (err) {
        console.error("Error while sending email:", err);
      }
    }

    // Sending response with order summary
    res.status(200).json({
      success: true,
      message: "Order statement generated successfully",
      data: {
        user: {
          name: user.ownerName || user.name,
          storeName: user.storeName,
          phone: user.phone,
          email: user.email,
          address: user.address,
          city: user.city,
          state: user.state,
          zipCode: user.zipCode,
        },
        filters: {
          paymentStatus,
          startMonth: startMonth || "all",
          endMonth: endMonth || "all",
        },
        summaryByMonth: summary,
        totalPaid,
        totalPending,
        totalProductsOrdered,
        closingBalance: totalPending,
      },
    });
  } catch (err) {
    console.error("Error generating user statement:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// const updateShippingController = async (req, res) => {
//   try {
//     // Extract the required values from the request body
//     const { orderId, newShippingCost, plateCount } = req.body;

//     // Validate input
//     if (!orderId || !newShippingCost || !plateCount) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide orderId, newShippingCost, and plateCount.",
//       });
//     }

//     // Fetch order from the database
//     const order = await orderModel.findById(orderId);
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found.",
//       });
//     }

//     // Store the old shipping cost
//     const oldShippingCost = order.shippinCost;

//     // Calculate new shipping cost by multiplying with plate count
//     const calculatedShippingCost = newShippingCost * plateCount;

//     // Update the order's shipping cost and total

//     order.shippinCost = calculatedShippingCost; // New shipping cost
//     order.total = order.total + (calculatedShippingCost - oldShippingCost); // Update total cost

//     // Save the updated order in the database
//     await order.save();

//     // Respond with success message
//     return res.status(200).json({
//       success: true,
//       message: `Shipping cost updated successfully. Old Shipping Cost: ${oldShippingCost}, New Shipping Cost: ${calculatedShippingCost}`,
//       updatedOrder: order, // Optionally send updated order details
//     });
//   } catch (error) {
//     console.error("Error updating shipping cost:", error);
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while updating the shipping cost.",
//     });
//   }
// };

const updateShippingController = async (req, res) => {
  try {
    const { orderId, newShippingCost, plateCount } = req.body;

    // Validate input
    if (!orderId || newShippingCost == null || plateCount == null) {
      return res.status(400).json({
        success: false,
        message: "Please provide orderId, newShippingCost, and plateCount.",
      });
    }

    // Parse numbers safely
    const shippingPerPlate = parseFloat(newShippingCost);
    const plateQty = parseInt(plateCount);

    if (isNaN(shippingPerPlate) || isNaN(plateQty)) {
      return res.status(400).json({
        success: false,
        message: "Shipping cost and plate count must be valid numbers.",
      });
    }

    // Fetch order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Calculate item total
    const items = order.items || [];
    const itemTotal = items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity || 0);
      const price = parseFloat(item.unitPrice || 0);
      return sum + quantity * price;
    }, 0);

    // Calculate new shipping cost
    const calculatedShippingCost = shippingPerPlate * plateQty;

    // Final total
    const newTotal = itemTotal + calculatedShippingCost;

    // Update the order
    order.shippinCost = calculatedShippingCost;
    order.total = newTotal;
    order.plateCount = plateQty;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order total recalculated and shipping updated.",
      itemTotal,
      shippingCost: calculatedShippingCost,
      total: newTotal,
      updatedOrder: order,
    });
  } catch (error) {
    console.error("Error updating shipping cost:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the shipping cost.",
    });
  }
};

const getDashboardData = async (req, res) => {
  try {
    // Total Orders
    const totalOrders = await orderModel.countDocuments();

    // Total Stores
    const totalStores = await authModel.countDocuments({ role: "store" });

    // Aggregation for Payment Data
    const paymentData = await orderModel.aggregate([
      {
        $project: {
          total: 1,
          paymentStatus: 1,
          status: 1,
          paymentAmount: { $toDouble: { $ifNull: ["$paymentAmount", "0"] } },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$total" },
          totalReceived: {
            $sum: {
              $cond: [
                { $eq: ["$paymentStatus", "paid"] },
                "$total", // fully paid orders
                {
                  $cond: [
                    { $eq: ["$paymentStatus", "partial"] },
                    "$paymentAmount", // partial payment amount
                    0,
                  ],
                },
              ],
            },
          },
          // Pending Orders
          pendingPaidAmount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "pending"] },
                    { $eq: ["$paymentStatus", "partial"] },
                  ],
                },
                "$paymentAmount",
                0,
              ],
            },
          },
          pendingDueAmount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "pending"] },
                    { $ne: ["$paymentStatus", "paid"] },
                  ],
                },
                { $subtract: ["$total", "$paymentAmount"] },
                0,
              ],
            },
          },
          // Delivered Orders
          deliveredPaidAmount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "delivered"] },
                    { $eq: ["$paymentStatus", "partial"] },
                  ],
                },
                "$paymentAmount",
                {
                  $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$total", 0],
                },
              ],
            },
          },
          deliveredDueAmount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "delivered"] },
                    { $ne: ["$paymentStatus", "paid"] },
                  ],
                },
                { $subtract: ["$total", "$paymentAmount"] },
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          totalAmount: 1,
          totalReceived: 1,
          totalPending: { $subtract: ["$totalAmount", "$totalReceived"] },
          pendingPaidAmount: 1,
          pendingDueAmount: 1,
          deliveredPaidAmount: 1,
          deliveredDueAmount: 1,
        },
      },
    ]);

    const totalAmount = paymentData[0]?.totalAmount || 0;
    const totalReceived = paymentData[0]?.totalReceived || 0;
    const totalPending = paymentData[0]?.totalPending || 0;
    const pendingPaidAmount = paymentData[0]?.pendingPaidAmount || 0;
    const pendingDueAmount = paymentData[0]?.pendingDueAmount || 0;
    const deliveredPaidAmount = paymentData[0]?.deliveredPaidAmount || 0;
    const deliveredDueAmount = paymentData[0]?.deliveredDueAmount || 0;

    // Top 10 Users by Order Amount
    const topUsers = await orderModel.aggregate([
      {
        $group: {
          _id: "$store",
          totalAmount: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "auths",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: "$userDetails.ownerName",
          storeName: "$userDetails.storeName",
          email: "$userDetails.email",
          orderCount: 1,
          totalAmount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        totalOrders,
        totalStores,
        totalAmount,
        totalReceived,
        totalPending,
        pendingOrders: {
          paidAmount: pendingPaidAmount,
          dueAmount: pendingDueAmount,
        },
        deliveredOrders: {
          paidAmount: deliveredPaidAmount,
          dueAmount: deliveredDueAmount,
        },
        topUsers,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard data",
      error: error.message,
    });
  }
};

const invoiceMailCtrl = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findById(id).populate("store");

    console.log(order);
    const responsePDF = await exportInvoiceToPDFBackend({
      id: order.orderNumber,
      clientId: order.store._id,
      clientName: order.store.storeName,
      shippinCost: order.shippinCost || 0,
      date: order.createdAt,
      shippingAddress: order?.shippingAddress,
      billingAddress: order?.billingAddress,
      status: order.status,
      items: order.items,
      total: order.total,
      paymentStatus: order.paymentStatus || "pending",
      subtotal: order.total,
      store: order.store,
      paymentDetails: order.paymentDetails || {},
    });

    // const customerEmail = "vikasmaheshwari6267@gmail.com" ;
    const customerEmail = order.store.email;
    const subject = `Invoice #${order.orderNumber}`;
    const message = `
      Hi ,

      Thank you for your order! Please find your invoice attached for your recent purchase with us.

      🧾 Invoice Number: ${order.orderNumber}
      📅 Date: ${new Date(order.createdAt).toLocaleDateString()}

      We're awaiting the cheque/payment. Kindly update us on the status at your earliest convenience. If you have any questions or need assistance, feel free to reach out. We appreciate your business and look forward to serving you again!

    Best regards,

    Nada Saiyed
    Sales Manager
    Vali Produce LLC, Atlanta, GA
    501-559-0123
        `;

    await mailSender(
      customerEmail,
      subject,
      message,
      responsePDF,
      `INVOICE- #${order.orderNumber}`
    );
    console.log("Email sent successfully to:", customerEmail);

    res.status(200).json({
      success: true,
      message: "Order type updated successfully",
    });
  } catch (error) {
    console.error("Error updating orderType:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await orderModel.aggregate([
      {
        $group: {
          _id: "$store", // ensure this is your correct field for store reference
          totalOrders: { $sum: 1 },
          totalAmount: { $sum: "$total" },
          totalPaid: {
            $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$total", 0] },
          },
          totalPending: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "pending"] }, "$total", 0],
            },
          },
        },
      },
      {
        $match: { totalPending: { $gt: 0 } }, // only stores with pending amount
      },
      {
        $lookup: {
          from: "auths",
          localField: "_id",
          foreignField: "_id",
          as: "storeInfo",
        },
      },
      {
        $unwind: {
          path: "$storeInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { totalPending: -1 }, // sort by pending amount descending
      },
      {
        $project: {
          storeName: "$storeInfo.storeName",
          storeEmail: "$storeInfo.email",
          totalOrders: 1,
          totalAmount: 1,
          totalPaid: 1,
          totalPending: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Pending orders by store fetched successfully",
      data: pendingOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching pending orders by store",
      error: error.message,
    });
  }
};

module.exports = {
  createOrderCtrl,
  getAllOrderCtrl,
  getOrderForStoreCtrl,
  updateOrderCtrl,
  updatePalletInfo,
  userDetailsWithOrder,
  updatePaymentDetails,
  deleteOrderCtrl,
  deleteOrderHardCtrl,
  updateOrderTypeCtrl,
  getUserOrderStatement,
  updateShippingController,
  getDashboardData,
  getPendingOrders,
  invoiceMailCtrl,
  markOrderAsUnpaid,
};
