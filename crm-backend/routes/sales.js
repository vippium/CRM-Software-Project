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

router.get("/", auth, getAllSales);
router.get("/:id", auth, getSaleById);
router.post("/", auth, roleCheck(["admin"]), createSale);
router.put("/:id", auth, roleCheck(["admin", "sales"]), updateSale);

export default router;