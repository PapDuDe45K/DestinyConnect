// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/signup'];

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('__session')?.value;
  const { pathname } = request.nextUrl;

  // Redirect to login if trying to access protected route without auth
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect to dashboard if logged in and trying to access public route
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}