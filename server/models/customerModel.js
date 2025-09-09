const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  // Basic Information
  storeName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  ownerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  
  // Address Information
  address: {
    type: String,
    trim: true,
    maxlength: 200
  },
  city: {
    type: String,
    trim: true,
    maxlength: 50
  },
  state: {
    type: String,
    trim: true,
    maxlength: 50
  },
  zipCode: {
    type: String,
    trim: true,
    maxlength: 10
  },
  
  // Business Information
  businessType: {
    type: String,
    enum: ['Restaurant', 'Grocery Store', 'Supermarket', 'Cafe', 'Hotel', 'Catering', 'Other'],
    default: 'Other'
  },
  taxId: {
    type: String,
    trim: true,
    maxlength: 20
  },
  
  // Financial Information
  creditLimit: {
    type: Number,
    default: 0,
    min: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  paymentTerms: {
    type: String,
    enum: ['Cash', 'Net 15', 'Net 30', 'Net 45', 'Net 60'],
    default: 'Net 30'
  },
  discountRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Status and Activity
  isActive: {
    type: Boolean,
    default: true
  },
  customerSince: {
    type: Date,
    default: Date.now
  },
  lastOrderDate: {
    type: Date
  },
  
  // Additional Information
  notes: {
    type: String,
    maxlength: 500
  },
  contactPerson: {
    type: String,
    trim: true,
    maxlength: 100
  },
  
  // Delivery Information
  deliveryInstructions: {
    type: String,
    maxlength: 300
  },
  preferredDeliveryDay: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  route: {
    type: String,
    trim: true,
    maxlength: 50
  },
  
  // Customer Statistics (calculated fields)
  totalOrders: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  avgOrderValue: {
    type: Number,
    default: 0
  },
  
  // Customer Preferences
  preferredProducts: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    frequency: {
      type: String,
      enum: ['Weekly', 'Bi-weekly', 'Monthly', 'Seasonal']
    }
  }],
  
  // Communication Preferences
  communicationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    phone: {
      type: Boolean,
      default: true
    }
  },
  
  // Customer Rating/Feedback
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  // Tags for categorization
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  
  // Customer Source
  source: {
    type: String,
    enum: ['Referral', 'Website', 'Phone Call', 'Walk-in', 'Social Media', 'Advertisement', 'Other'],
    default: 'Other'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
customerSchema.index({ storeName: 1 });
customerSchema.index({ email: 1 }, { unique: true, sparse: true });
customerSchema.index({ phone: 1 }, { unique: true });
customerSchema.index({ city: 1 });
customerSchema.index({ isActive: 1 });
customerSchema.index({ route: 1 });
customerSchema.index({ businessType: 1 });

// Virtual for full address
customerSchema.virtual('fullAddress').get(function() {
  const parts = [this.address, this.city, this.state, this.zipCode].filter(Boolean);
  return parts.join(', ');
});

// Virtual for customer status
customerSchema.virtual('status').get(function() {
  return this.isActive ? 'Active' : 'Inactive';
});

// Pre-save middleware
customerSchema.pre('save', function(next) {
  // Ensure phone number is properly formatted
  if (this.phone) {
    this.phone = this.phone.replace(/\D/g, ''); // Remove non-digits
  }
  
  // Set customer since date on first save
  if (this.isNew) {
    this.customerSince = new Date();
  }
  
  next();
});

// Static methods
customerSchema.statics.findActiveCustomers = function() {
  return this.find({ isActive: true });
};

customerSchema.statics.findByRoute = function(route) {
  return this.find({ route: route, isActive: true });
};

customerSchema.statics.findByBusinessType = function(businessType) {
  return this.find({ businessType: businessType, isActive: true });
};

// Instance methods
customerSchema.methods.updateOrderStats = async function(orderAmount) {
  this.totalOrders += 1;
  this.totalRevenue += orderAmount;
  this.avgOrderValue = this.totalRevenue / this.totalOrders;
  this.lastOrderDate = new Date();
  return this.save();
};

customerSchema.methods.deactivate = function() {
  this.isActive = false;
  return this.save();
};

customerSchema.methods.activate = function() {
  this.isActive = true;
  return this.save();
};

module.exports = mongoose.model('Customer', customerSchema);