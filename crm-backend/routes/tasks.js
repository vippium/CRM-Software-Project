import express from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getUnseenTasks,
  markTaskAsSeen,
} from "../controllers/taskController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks (Sales only see assigned)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Task"
 */

router.get("/", auth, getAllTasks);

/**
 * @swagger
 * /tasks/unseen:
 *   get:
 *     summary: Get unseen tasks (Sales only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unseen tasks
 */
router.get("/unseen", auth, roleCheck(["sales"]), getUnseenTasks);

/**
 * @swagger
 * /tasks/{id}/seen:
 *   patch:
 *     summary: Mark a task as seen
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task marked as seen
 */
router.patch("/:id/seen", auth, roleCheck(["sales"]), markTaskAsSeen);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task found
 */
router.get("/:id", auth, getTaskById);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create new task (Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Task created
 */
router.post("/", auth, roleCheck(["admin"]), createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task (Sales can only change status)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task updated
 */
router.put("/:id", auth, roleCheck(["admin", "sales"]), updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task (Admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete("/:id", auth, roleCheck(["admin"]), deleteTask);

export default router;
