import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'caseStudy123');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  console.log("✅ Middleware running on:", pathname);
  console.log("📦 Token:", token);

  // ✅ 1. If user visits /login and already has valid token → redirect to home
  if (pathname === '/login') {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
        console.log("✅ Token valid, redirecting to / from /login");
        return NextResponse.redirect(new URL('/', request.url));
      } catch {
        console.log("⚠️ Invalid token, allow login page");
        return NextResponse.next();
      }
    }
    return NextResponse.next(); // No token, show login
  }

  // ✅ 2. For protected routes
  if (pathname === '/' || pathname.startsWith('/case-studies')) {
    if (!token) {
      console.log("⛔ No token. Redirecting to login...");
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
      const res = NextResponse.next();
      res.headers.set('Cache-Control', 'no-store'); // prevent back-nav cache
      return res;
    } catch (err) {
      console.log("⛔ Token invalid/expired. Redirecting...");
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/case-studies/:slug*'],
};
