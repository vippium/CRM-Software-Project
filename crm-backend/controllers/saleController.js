import Sale from "../models/Sale.js";

// Get all sales
export const getAllSales = async (req, res) => {
  try {
    const filter =
      req.user.role === "admin" ? {} : { assignedRep: req.user.id };

    const sales = await Sale.find(filter)
      .sort({ createdAt: -1 })
      .populate("customerId", "name")
      .populate("assignedRep", "name email");

    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single sale
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("customerId", "name")
      .populate("assignedRep", "name email");

    if (!sale) return res.status(404).json({ message: "Sale not found" });

    if (
      req.user.role !== "admin" &&
      sale.assignedRep?._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create sale
export const createSale = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update sale
export const updateSale = async (req, res) => {
  try {
    if (req.user.role === "sales" && req.body.status) {
      req.body = { status: req.body.status };
    }

    const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("customerId", "name email")
      .populate("assignedRep", "name email role");

    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.json(sale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
