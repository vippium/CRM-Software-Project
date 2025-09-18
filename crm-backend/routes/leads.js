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

router.get("/", auth, getAllLeads);
router.get("/:id", auth, getLeadById);
router.post("/", auth, roleCheck(["admin"]), createLead);
router.put("/:id", auth, roleCheck(["admin", "sales"]), updateLead);
router.delete("/:id", auth, roleCheck(["admin"]), deleteLead);

export default router;