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

router.get("/", auth, getAllCustomers);
router.get("/:id", auth, getCustomerById);
router.post("/", auth, roleCheck(["admin"]), createCustomer);
router.put("/:id", auth, roleCheck(["admin", "sales"]), updateCustomer);
router.delete("/:id", auth, roleCheck(["admin"]), deleteCustomer);

export default router;