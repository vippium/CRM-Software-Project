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

router.get("/", auth, getAllTasks);
router.get("/unseen", auth, roleCheck(["sales"]), getUnseenTasks);
router.patch("/:id/seen", auth, roleCheck(["sales"]), markTaskAsSeen);
router.get("/:id", auth, getTaskById);
router.post("/", auth, roleCheck(["admin"]), createTask);
router.put("/:id", auth, roleCheck(["admin", "sales"]), updateTask);
router.delete("/:id", auth, roleCheck(["admin"]), deleteTask);

export default router;