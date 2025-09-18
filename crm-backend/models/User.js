import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'sales'], default: 'sales' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;