import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    company: { type: String },
    address: { type: String },
    assignedRep: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    notes: { type: String },
}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);