import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Raju Sharma
 *               email:
 *                 type: string
 *                 example: raju@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum: [admin, sales]
 *     responses:
 *       200:
 *         description: Successfully registered
 *       400:
 *         description: Missing fields or user exists
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in to the system
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: raju@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful, returns JWT
 *       400:
 *         description: Invalid credentials
 */
router.post("/register", register);
router.post("/login", login);

export default router;
