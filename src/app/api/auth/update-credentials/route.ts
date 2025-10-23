import { NextRequest, NextResponse } from 'next/server';
import { updateUserCredentials } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { currentEmail, newEmail, newPassword } = await request.json();
    
    if (!currentEmail || !newEmail || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }
    
    const success = await updateUserCredentials(currentEmail, newEmail, newPassword);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Credentials updated successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to update credentials' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Update credentials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
