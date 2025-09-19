import Customer from "../models/Customer.js";
import User from "../models/User.js";

// Get all customers
export const getAllCustomers = async(req, res) => {
    try {
        const customers = await Customer.find()
            .sort({ createdAt: -1 })
            .populate("assignedRep", "name email role");
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get customer by ID
export const getCustomerById = async(req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .populate("assignedRep", "name email role");
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new customer
export const createCustomer = async(req, res) => {
    try {
        // Optional validation: check assignedRep if provided
        if (req.body.assignedRep) {
            const rep = await User.findById(req.body.assignedRep);
            if (!rep || rep.role !== "sales") {
                return res.status(400).json({ message: "Invalid assigned representative" });
            }
        }

        const customer = new Customer(req.body);
        await customer.save();
        const populatedCustomer = await customer.populate("assignedRep", "name email role");

        res.status(201).json(populatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update customer
export const updateCustomer = async(req, res) => {
    try {
        // Optional validation: check assignedRep if provided
        if (req.body.assignedRep) {
            const rep = await User.findById(req.body.assignedRep);
            if (!rep || rep.role !== "sales") {
                return res.status(400).json({ message: "Invalid assigned representative" });
            }
        }

        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).populate("assignedRep", "name email role");

        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json(customer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete customer
export const deleteCustomer = async(req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};