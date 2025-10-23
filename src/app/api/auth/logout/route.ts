import { NextResponse } from 'next/server';

export async function POST() {
  return new NextResponse(
    JSON.stringify({ message: 'Logged out' }),
    {
      status: 200,
      headers: {
        'Set-Cookie': [
          'token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
          'role=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
        ].join(', '),
        'Content-Type': 'application/json',
      },
    }
  );
} 