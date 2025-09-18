import Sale from "../models/Sale.js";

// Get all sales (with customer name populated)
export const getAllSales = async(req, res) => {
    try {
        const sales = await Sale.find()
            .sort({ createdAt: -1 })
            .populate("customerId", "name"); // 👈 fetch only `name` field
        res.json(sales);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new sale
export const createSale = async(req, res) => {
    try {
        const sale = new Sale(req.body); // expects `customerId` = ObjectId
        await sale.save();
        res.status(201).json(sale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get single sale by ID
export const getSaleById = async(req, res) => {
    try {
        const sale = await Sale.findById(req.params.id).populate("customerId", "name");
        if (!sale) return res.status(404).json({ message: "Sale not found" });
        res.json(sale);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update sale (rare, but keep for safety)
export const updateSale = async(req, res) => {
    try {
        const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate("customerId", "name");
        if (!sale) return res.status(404).json({ message: "Sale not found" });
        res.json(sale);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};