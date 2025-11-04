import Task from "../models/Task.js";
import Notification from "../models/notification.js";

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { assignedTo: req.user.id };

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email role")
      .populate("customerId", "name email company");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single task
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email role")
      .populate("customerId", "name email company");

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      req.user.role !== "admin" &&
      task.assignedTo?._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a task
export const createTask = async(req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();

        if (task.assignedTo) {
            const notification = await Notification.create({
                userId: task.assignedTo,
                taskId: task._id,
                message: `A new task "${task.title}" has been assigned to you.`,
            });

            // 🔥 Emit real-time notification
            req.app
                .get("io")
                .to(task.assignedTo.toString())
                .emit("newNotification", notification);
        }

        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a task
export const updateTask = async(req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
            .populate("assignedTo", "name email role")
            .populate("customerId", "name email company");

        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.assignedTo) {
            const notification = await Notification.create({
                userId: task.assignedTo._id || task.assignedTo,
                taskId: task._id,
                message: `Task "${task.title}" has been updated.`,
            });

            // 🔥 Emit real-time notification
            req.app
                .get("io")
                .to((task.assignedTo._id || task.assignedTo).toString())
                .emit("newNotification", notification);
        }

        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a task
export const deleteTask = async(req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (task.assignedTo) {
            const notification = await Notification.create({
                userId: task.assignedTo,
                taskId: task._id,
                message: `Task "${task.title}" has been deleted.`,
            });

            // 🔥 Emit real-time notification
            req.app
                .get("io")
                .to(task.assignedTo.toString())
                .emit("newNotification", notification);
        }

        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get unseen tasks (for sales)
export const getUnseenTasks = async(req, res) => {
    try {
        const tasks = await Task.find({
                assignedTo: req.user.id,
                seenByUser: false,
            })
            .populate("customerId", "name company")
            .populate("assignedTo", "name email");

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Error fetching unseen tasks", error: err });
    }
};

// Mark a task as seen
export const markTaskAsSeen = async(req, res) => {
    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id, assignedTo: req.user.id }, { seenByUser: true }, { new: true });

        if (!task) {
            return res
                .status(404)
                .json({ message: "Task not found or not assigned to you" });
        }

        res.json({ message: "Task marked as seen", task });
    } catch (err) {
        res
            .status(500)
            .json({ message: "Error marking task as seen", error: err });
    }
};
