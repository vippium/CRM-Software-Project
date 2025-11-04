import express from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Manage leads in the CRM system
 */

/**
 * @swagger
 * /leads:
 *   get:
 *     summary: Get all leads (filtered by assigned rep for Sales)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of leads
 */
router.get("/", auth, getAllLeads);

/**
 * @swagger
 * /leads/{id}:
 *   get:
 *     summary: Get lead by ID
 *     tags: [Leads]
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
 *         description: Lead details
 *       404:
 *         description: Lead not found
 */
router.get("/:id", auth, getLeadById);

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Create a new lead (Admin only)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Lead"
 *     responses:
 *       201:
 *         description: Lead created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Lead"
 */

router.post("/", auth, roleCheck(["admin"]), createLead);

/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     summary: Update a lead (Admins can edit all, Sales only limited fields)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lead updated
 */
router.put("/:id", auth, roleCheck(["admin", "sales"]), updateLead);

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     summary: Delete a lead (Admin only)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lead deleted
 */
router.delete("/:id", auth, roleCheck(["admin"]), deleteLead);

export default router;
