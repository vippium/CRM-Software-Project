import Customer from "../models/Customer.js";

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

export const createCustomer = async(req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateCustomer = async(req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json(customer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteCustomer = async(req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};