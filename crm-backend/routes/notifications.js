import express from "express";
import auth from "../middleware/auth.js";
import {
    getNotifications,
    markAsSeen,
    markAllAsSeen,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/test", (req, res) => {
    res.json({ message: "🔔 Notifications API is alive!" });
});

router.get("/", auth, getNotifications);
router.patch("/:id/seen", auth, markAsSeen);
router.patch("/seen/all", auth, markAllAsSeen);

export default router;