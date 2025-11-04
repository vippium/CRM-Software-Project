import express from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
} from "../controllers/customerController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Manage customer records
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Customer"
 */
router.get("/", auth, getAllCustomers);

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Get a single customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer found
 *       404:
 *         description: Not found
 */
router.get("/:id", auth, getCustomerById);

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Customer"
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Customer"
 */
router.post("/", auth, roleCheck(["admin"]), createCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     summary: Update customer info
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer updated
 */
router.put("/:id", auth, roleCheck(["admin", "sales"]), updateCustomer);

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     summary: Delete a customer (Admin only)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer deleted
 */
router.delete("/:id", auth, roleCheck(["admin"]), deleteCustomer);

export default router;
