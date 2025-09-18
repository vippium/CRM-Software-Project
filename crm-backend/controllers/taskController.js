import Task from "../models/Task.js";

export const getAllTasks = async(req, res) => {
    try {
        const tasks = await Task.find()
            .populate("assignedTo", "name email role")
            .populate("customerId", "name email company");
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTaskById = async(req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createTask = async(req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateTask = async(req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteTask = async(req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};