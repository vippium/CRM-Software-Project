import Lead from "../models/Lead.js";

export const getAllLeads = async(req, res) => {
    try {
        const leads = await Lead.find()
            .populate("assignedRep", "name email role")
            .populate("customerId", "name email company");
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getLeadById = async(req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ message: "Lead not found" });
        res.json(lead);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createLead = async(req, res) => {
    try {
        const lead = new Lead(req.body);
        await lead.save();
        res.status(201).json(lead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateLead = async(req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!lead) return res.status(404).json({ message: "Lead not found" });
        res.json(lead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteLead = async(req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ message: "Lead not found" });
        res.json({ message: "Lead deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};