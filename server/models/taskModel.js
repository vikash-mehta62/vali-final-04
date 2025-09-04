const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
    },

    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    priority: {
        type: String,

    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },

    status: {
        type: String,
    },
    title: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Task', TaskSchema);