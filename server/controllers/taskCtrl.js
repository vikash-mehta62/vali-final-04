const Task = require('../models/taskModel');

// ✅ Create Task
exports.createTask = async (req, res) => {
    try {
        const { assignedTo, title, description, dueDate, priority, progress, status } = req.body;

        // 🛑 Validation
        if (!title || title.length < 3) return res.status(400).json({ success: false, message: "Title must be at least 3 characters long." });
        if (!description || description.length < 5) return res.status(400).json({ success: false, message: "Description must be at least 5 characters long." });
        if (!dueDate || isNaN(new Date(dueDate))) return res.status(400).json({ success: false, message: "Invalid due date." });
        if (priority && !["low", "medium", "high", "urgent", ""].includes(priority.toLowerCase())) return res.status(400).json({ success: false, message: "Invalid priority." });

        // ✅ Save to Database
        const task = new Task({ assignedTo, title, description, dueDate, priority, progress, status });
        await task.save();

        res.status(201).json({ success: true, message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get All Tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo").exec();
        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// ✅ Update Task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        // ✅ Update valid fields
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] !== undefined) task[key] = updateData[key];
        });

        await task.save();
        res.json({ success: true, message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);

        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        res.json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};