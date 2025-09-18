import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register
export const register = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ msg: "Missing fields" });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = new User({ name, email, password: hashed, role });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN || "1d" }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Login
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ msg: "Missing fields" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN || "1d" }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};