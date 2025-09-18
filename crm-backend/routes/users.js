import express from "express";
import auth from "../middleware/auth.js";
import { getMe, getSalesReps } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", auth, getMe);
router.get("/sales-reps", auth, getSalesReps);

export default router;