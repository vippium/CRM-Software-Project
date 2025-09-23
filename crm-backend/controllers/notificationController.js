import Notification from "../models/notification.js";

// Get all notifications for logged-in user
export const getNotifications = async(req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate("taskId", "title dueDate status");

        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications", error: err });
    }
};

// Mark a single notification as seen
export const markAsSeen = async(req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { seen: true }, { new: true });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: "Error updating notification", error: err });
    }
};

// Mark all notifications as seen
export const markAllAsSeen = async(req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.id, seen: false }, { $set: { seen: true } });

        res.json({ message: "All notifications marked as seen" });
    } catch (err) {
        res.status(500).json({ message: "Error updating notifications", error: err });
    }
};