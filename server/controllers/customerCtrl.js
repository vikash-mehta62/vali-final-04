const Customer = require('../models/customerModel');
const Auth = require('../models/authModel');
const Order = require('../models/orderModel');

// Get all customers with analytics
const getAllCustomersWithAnalytics = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, riskLevel, search } = req.query;
    
    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (riskLevel && riskLevel !== 'all') {
      query.riskLevel = riskLevel;
    }
    if (search) {
      query.$or = [
        { storeName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get customers from auth model (stores)
    const customers = await Auth.find({ role: 'store', ...query })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    // Enhance with analytics data
    const enhancedCustomers = await Promise.all(
      customers.map(async (customer) => {
        const orders = await Order.find({ 'store': customer._id });
        
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
        
        const lastOrder = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        const daysSinceLastOrder = lastOrder 
          ? Math.floor((Date.now() - new Date(lastOrder.createdAt)) / (1000 * 60 * 60 * 24))
          : 999;
        
        // Calculate risk level
        let riskLevel = 'low';
        let status = 'active';
        
        if (daysSinceLastOrder > 60) {
          riskLevel = 'high';
          status = 'at-risk';
        } else if (daysSinceLastOrder > 30) {
          riskLevel = 'medium';
          status = 'at-risk';
        } else if (daysSinceLastOrder > 90) {
          status = 'inactive';
        }
        
        return {
          ...customer.toObject(),
          totalOrders: orders.length,
          totalRevenue,
          avgOrderValue,
          lastOrderDate: lastOrder?.createdAt,
          daysSinceLastOrder,
          status,
          riskLevel
        };
      })
    );
    
    const total = await Auth.countDocuments({ role: 'store', ...query });
    
    res.status(200).json({
      success: true,
      customers: enhancedCustomers,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching customers with analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer analytics'
    });
  }
};

// Get customer insights with AI predictions
const getCustomerInsights = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const customer = await Auth.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    const orders = await Order.find({ 'store': customerId }).sort({ createdAt: -1 });
    
    // Calculate insights
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    // Order frequency analysis
    const orderDates = orders.map(order => new Date(order.createdAt));
    const daysBetweenOrders = [];
    
    for (let i = 1; i < orderDates.length; i++) {
      const days = Math.floor((orderDates[i-1] - orderDates[i]) / (1000 * 60 * 60 * 24));
      daysBetweenOrders.push(days);
    }
    
    const avgDaysBetweenOrders = daysBetweenOrders.length > 0 
      ? daysBetweenOrders.reduce((sum, days) => sum + days, 0) / daysBetweenOrders.length 
      : 30;
    
    // Predict next order
    const lastOrderDate = orderDates[0] || new Date();
    const predictedNextOrder = new Date(lastOrderDate.getTime() + (avgDaysBetweenOrders * 24 * 60 * 60 * 1000));
    
    // Product preferences
    const productMap = new Map();
    orders.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          const key = item.category || 'Other';
          productMap.set(key, (productMap.get(key) || 0) + (item.quantity || 1));
        });
      }
    });
    
    const preferredCategories = Array.from(productMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
    
    // Loyalty score calculation
    const daysSinceLastOrder = Math.floor((Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
    const orderFrequency = orders.length / Math.max(daysSinceLastOrder / 30, 1); // orders per month
    
    const loyaltyScore = Math.min(100, Math.max(0,
      (orders.length * 5) + // Order count factor
      (totalRevenue / 100) + // Revenue factor
      (orderFrequency * 10) - // Frequency factor
      (daysSinceLastOrder * 0.3) // Recency penalty
    ));
    
    // Risk assessment
    let riskLevel = 'low';
    if (daysSinceLastOrder > avgDaysBetweenOrders * 2) {
      riskLevel = 'high';
    } else if (daysSinceLastOrder > avgDaysBetweenOrders * 1.5) {
      riskLevel = 'medium';
    }
    
    // Seasonal trends (simplified)
    const monthlyOrders = new Array(12).fill(0);
    orders.forEach(order => {
      const month = new Date(order.createdAt).getMonth();
      monthlyOrders[month]++;
    });
    
    const insights = {
      customer: {
        id: customer._id,
        storeName: customer.storeName,
        ownerName: customer.ownerName,
        email: customer.email
      },
      metrics: {
        totalOrders: orders.length,
        totalRevenue,
        avgOrderValue,
        orderFrequency: Math.round(orderFrequency * 100) / 100,
        loyaltyScore: Math.round(loyaltyScore),
        daysSinceLastOrder,
        avgDaysBetweenOrders: Math.round(avgDaysBetweenOrders)
      },
      predictions: {
        nextOrderDate: predictedNextOrder.toISOString().split('T')[0],
        riskLevel,
        churnProbability: riskLevel === 'high' ? 0.8 : riskLevel === 'medium' ? 0.4 : 0.1
      },
      preferences: {
        categories: preferredCategories,
        seasonalTrends: monthlyOrders
      },
      recommendations: generateRecommendations(riskLevel, daysSinceLastOrder, avgDaysBetweenOrders)
    };
    
    res.status(200).json({
      success: true,
      insights
    });
  } catch (error) {
    console.error('Error generating customer insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate customer insights'
    });
  }
};

// Generate recommendations based on customer data
const generateRecommendations = (riskLevel, daysSinceLastOrder, avgDaysBetweenOrders) => {
  const recommendations = [];
  
  if (riskLevel === 'high') {
    recommendations.push({
      type: 'retention',
      priority: 'high',
      action: 'Send personalized re-engagement email',
      reason: `Customer hasn't ordered in ${daysSinceLastOrder} days`
    });
    recommendations.push({
      type: 'discount',
      priority: 'high',
      action: 'Offer 15% discount on next order',
      reason: 'High churn risk - incentivize return'
    });
  } else if (riskLevel === 'medium') {
    recommendations.push({
      type: 'follow-up',
      priority: 'medium',
      action: 'Schedule follow-up call',
      reason: 'Customer may need assistance or has concerns'
    });
  } else {
    recommendations.push({
      type: 'upsell',
      priority: 'low',
      action: 'Suggest complementary products',
      reason: 'Loyal customer - good upsell opportunity'
    });
  }
  
  if (daysSinceLastOrder > avgDaysBetweenOrders) {
    recommendations.push({
      type: 'reminder',
      priority: 'medium',
      action: 'Send order reminder',
      reason: 'Customer is overdue for typical order cycle'
    });
  }
  
  return recommendations;
};

// Update customer data
const updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const updateData = req.body;
    
    const customer = await Auth.findByIdAndUpdate(
      customerId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer'
    });
  }
};

module.exports = {
  getAllCustomersWithAnalytics,
  getCustomerInsights,
  updateCustomer
};