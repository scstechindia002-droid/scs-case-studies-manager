import { NextResponse, NextRequest } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { serialize } from 'cookie';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (user) {
      // Only allow login if user.isActive is true
      if (user.isActive === false) {
        return NextResponse.json({ error: 'User is inactive' }, { status: 401 });
      }
      // ✅ Generate JWT token with correct expiration
      let expiresIn;
      if (user.role === 'admin') {
        expiresIn = 60 * 60 * 24; // 1 day in seconds
      } else {
        expiresIn = user.sessionTime ? user.sessionTime * 60 : 60 * 60; // sessionTime in minutes, default 1 hour
      }
      const token = generateToken({ email: user.email, role: user.role }, expiresIn);

      // ✅ Prepare response first
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        user,
      });

      // ✅ Set cookie on response
      response.headers.set(
        'Set-Cookie',
        serialize('token', token, {
          path: '/',
          httpOnly: true,
          maxAge: 60 * 60 * 24,// 1day  for testing expiration
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        })
      );
     
      response.headers.append(
        'Set-Cookie',
        serialize('role',user.role , {
          path: '/',
          maxAge: 60 * 60 * 24,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        })
      )
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
