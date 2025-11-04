import express from "express";
import auth from "../middleware/auth.js";
import { getMe, getSalesReps } from "../controllers/userController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and sales rep endpoints
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get details of the logged-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details returned
 */
router.get("/me", auth, getMe);

/**
 * @swagger
 * /users/sales-reps:
 *   get:
 *     summary: Get all users with the "sales" role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sales representatives
 */
router.get("/sales-reps", auth, getSalesReps);

export default router;
