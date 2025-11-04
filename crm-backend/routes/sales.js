import express from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import {
  getAllSales,
  createSale,
  getSaleById,
  updateSale,
} from "../controllers/saleController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Manage sales and deals
 */

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get all sales (filtered by assigned rep)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sales
 */
router.get("/", auth, getAllSales);

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Get sale by ID
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sale found
 */
router.get("/:id", auth, getSaleById);

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Create a new sale (Admin only)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Sale created
 */
router.post("/", auth, roleCheck(["admin"]), createSale);

/**
 * @swagger
 * /sales/{id}:
 *   put:
 *     summary: Update sale (Admins full, Sales limited)
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sale updated
 */
router.put("/:id", auth, roleCheck(["admin", "sales"]), updateSale);

export default router;
