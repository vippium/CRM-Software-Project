import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactInfo: {
        email: { type: String },
        phone: { type: String },
    },
    source: {
        type: String,
        enum: ["Referral", "Ads", "Web", "Other"],
        default: "Other",
    },
    status: {
        type: String,
        enum: ["New", "Contacted", "Qualified", "Lost"],
        default: "New",
    },
    assignedRep: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },
    notes: { type: String },
}, { timestamps: true });

export default mongoose.model("Lead", leadSchema);