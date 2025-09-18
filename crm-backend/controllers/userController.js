import User from "../models/User.js";

export const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

export const getSalesReps = async(req, res) => {
    try {
        const reps = await User.find({ role: "sales" }).select("_id name email");
        res.json(reps);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};