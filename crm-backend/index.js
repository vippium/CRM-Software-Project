import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import customerRoutes from "./routes/customers.js";
import leadRoutes from "./routes/leads.js";
import taskRoutes from "./routes/tasks.js";
import salesRoutes from "./routes/sales.js";
import notificationRoutes from "./routes/notifications.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ origin: 'http://localhost:5173' }));

// DB connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
}
connectDB();

// Routes
app.get('/', (req, res) => res.send('✨ CRM Backend alive ✨'));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));