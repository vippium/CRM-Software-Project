import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer", // 👈 Reference to Customer collection
        required: true,
    },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Prospecting", "Negotiation", "Closed-Won", "Closed-Lost"],
        default: "Prospecting",
    },
    date: { type: Date, required: true },
    assignedRep: { type: String },
}, { timestamps: true });

export default mongoose.model("Sale", saleSchema);