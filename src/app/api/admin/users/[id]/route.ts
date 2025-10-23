import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

interface JwtPayload {
  email: string;
  role: string;
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
    const { name, email, phone, role, password, sessionTime, isActive } = await request.json();
    const updateData: any = { name, email, phone, role, sessionTime, isActive, updatedAt: new Date() };
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

export async function DELETE(request: NextRequest, context: any) {
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
    // Set isActive to false instead of deleting
    const updatedUser = await User.findByIdAndUpdate(params.id, { isActive: false, updatedAt: new Date() }, { new: true });
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('❌ Error deleting (deactivating) user:', error);
    return NextResponse.json({ message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined }, { status: 500 });
  }
} 