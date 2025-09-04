const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    status: { type: String, default: 'active' },
    assignedTasks: { type: Number, default: 0 }
});

module.exports = mongoose.model('Member', MemberSchema);
