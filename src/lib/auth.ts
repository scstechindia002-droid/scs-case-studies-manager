import bcrypt from 'bcryptjs';
import UserModel from '@/app/models/User'; // Mongoose model
import connectDB from '@/lib/mongodb';
import jwt from 'jsonwebtoken';

export interface User {
  username: string;
  password: string;
  email: string;
  role: string;
}


const JWT_SECRET = "caseStudy123"

// ✅ Create JWT token
export function generateToken(payload: any, expiresIn: string | number = '1d') {
  return jwt.sign(payload, process.env.JWT_SECRET || 'caseStudy123', {
    expiresIn,
  } as any);
}
// ✅ Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// ✅ Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// ✅ Authenticate user from MongoDB
export const authenticateUser = async (email: string, password: string): Promise<any> => {
  await connectDB();

  const user = await UserModel.findOne({ email });
  console.log(user, "check email");

  if (!user || user.isActive === false) return null;

  const isMatch = await verifyPassword(password, user.password);
  console.log(isMatch, "password check");

  if (!isMatch) return null;

  // Return user without password
  const { password: _, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

// ✅ Update user credentials
export const updateUserCredentials = async (
  currentEmail: string,
  newEmail: string,
  newPassword: string
): Promise<boolean> => {
  await connectDB();

  const user = await UserModel.findOne({ email: currentEmail });

  if (!user) return false;

  user.email = newEmail;
  user.password = await hashPassword(newPassword);

  await user.save();
  return true;
};

// create jwt token  and send in response