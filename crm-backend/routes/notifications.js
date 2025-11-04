import express from "express";
import auth from "../middleware/auth.js";
import {
  getNotifications,
  markAsSeen,
  markAllAsSeen,
} from "../controllers/notificationController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Handle user notifications
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get notifications for logged-in user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get("/", auth, getNotifications);

/**
 * @swagger
 * /notifications/{id}/seen:
 *   patch:
 *     summary: Mark a specific notification as seen
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification updated
 */
router.patch("/:id/seen", auth, markAsSeen);

/**
 * @swagger
 * /notifications/seen/all:
 *   patch:
 *     summary: Mark all notifications as seen
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked seen
 */
router.patch("/seen/all", auth, markAllAsSeen);

export default router;
