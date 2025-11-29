import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/iot/badges/definitions')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
  }

  if (pathname.startsWith('/iot-overview/admin')) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/iot/badges/definitions/:path*', '/iot-overview/admin/:path*']
};
