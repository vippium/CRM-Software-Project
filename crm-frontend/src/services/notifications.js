import API from "./api";

// Get all notifications for logged-in user
export const getNotifications = async() => {
    try {
        const res = await API.get("/notifications");
        return res.data;
    } catch (err) {
        console.error("Error fetching notifications:", err);
        throw err;
    }
};

// Mark a single notification as seen
export const markNotificationAsSeen = async(id) => {
    try {
        const res = await API.patch(`/notifications/${id}/seen`);
        return res.data;
    } catch (err) {
        console.error("Error marking notification as seen:", err);
        throw err;
    }
};

// Mark all notifications as seen
export const markAllAsSeen = async() => {
    try {
        const res = await API.patch("/notifications/seen/all");
        return res.data;
    } catch (err) {
        console.error("Error marking all notifications as seen:", err);
        throw err;
    }
};