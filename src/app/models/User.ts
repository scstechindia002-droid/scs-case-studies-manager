// models/User.ts
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: String,
  sessionTime: { type: Number, default: 1 }, // in minutes
  isActive: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date,
});

export default mongoose.models.User || mongoose.model('User', userSchema, 'Users'); // <== 'Users' collection
