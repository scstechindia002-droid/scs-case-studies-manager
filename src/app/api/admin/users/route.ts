import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User'; // Make sure this path is correct

interface JwtPayload {
  email: string;
  role: string;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: Date;
}

// RESTful admin user management API:
// - GET, POST: /api/admin/users (this file)
// - PUT, DELETE: /api/admin/users/[id] (see [id]/route.ts)
// Only admins can access these endpoints.

// Handles GET (list users) and POST (create user) for admin panel. Use /api/admin/users/[id] for PUT and DELETE.
export async function GET(request: NextRequest) {
  try {
    // ✅ Get token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: 'No token provided', requiresLogout: true },
        { status: 401 }
      );
    }

    // ✅ Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, 'caseStudy123') as JwtPayload;
    } catch {
      return NextResponse.json(
        { message: 'Invalid or expired token', requiresLogout: true },
        { status: 401 }
      );
    }

    // ✅ Connect to database
    await connectDB();

    // ✅ Check user role
    const currentUser = await User.findOne({ email: decoded.email });
    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found', requiresLogout: true },
        { status: 401 }
      );
    }
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { message: 'Access denied. Admin role required.', requiresLogout: true },
        { status: 403 }
      );
    }

    // ✅ Fetch all users (excluding sensitive fields)
    // Exclude the current admin from the users list for safety, and only show active users
    const users = await User.find({ _id: { $ne: currentUser._id }})
      .select('username name email phone role sessionTime isActive createdAt')
      .sort({ createdAt: -1 })
      .lean<UserData[]>(); // Type cast lean result
    console.log('Fetched users:', users);

    // ✅ Respond with user list
    return NextResponse.json({
      success: true,
      users,
      currentUser: {
        id: currentUser._id.toString(),
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      },
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: any) {
  const { params } = context;
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'No token provided', requiresLogout: true }, { status: 401 });
    }
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, 'caseStudy123') as JwtPayload;
    } catch {
      return NextResponse.json({ message: 'Invalid or expired token', requiresLogout: true }, { status: 401 });
    }
    await connectDB();
    const currentUser = await User.findOne({ email: decoded.email });
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Access denied. Admin role required.', requiresLogout: true }, { status: 403 });
    }
    const { username, name, email, phone, role, password, sessionTime, isActive } = await request.json();
    const updateData: any = {
      username,
      name,
      email,
      phone,
      role,
      sessionTime: Number(sessionTime),
      isActive,
      updatedAt: new Date(),
    };
    if (password && password.trim() !== '') {
      const bcrypt = require('bcryptjs');
      updateData.password = await bcrypt.hash(password, 10);
    }
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    const updatedUser = await User.findByIdAndUpdate(params.id, updateData, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'No token provided', requiresLogout: true }, { status: 401 });
    }
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, 'caseStudy123') as JwtPayload;
    } catch {
      return NextResponse.json({ message: 'Invalid or expired token', requiresLogout: true }, { status: 401 });
    }
    await connectDB();
    const currentUser = await User.findOne({ email: decoded.email });
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ message: 'Access denied. Admin role required.', requiresLogout: true }, { status: 403 });
    }
    const { username, name, email, phone, role, password, sessionTime } = await request.json();
    console.log('Creating user with sessionTime:', sessionTime);
    if (!username || !name || !email || !role || !password || !sessionTime) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    // Check if an active user already exists with this email
    const existingActiveUser = await User.findOne({ email, isActive: true });
    if (existingActiveUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }
    // Hash password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();
    const newUser = await User.create({
      username,
      name,
      email,
      phone,
      role,
      password: hashedPassword,
      sessionTime: Number(sessionTime),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined },
      { status: 500 }
    );
  }
}
