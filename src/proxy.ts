import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'apbs_session';

// Bu rotalar giriş gerektirmez
const PUBLIC_PATHS = ['/giris', '/api/auth/login', '/api/auth/logout', '/api/ping'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public path ise geç
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Static dosyalar ve _next için geç
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo') ||
    pathname.startsWith('/mersin') ||
    pathname.match(/\.(png|jpg|jpeg|svg|ico|webp)$/)
  ) {
    return NextResponse.next();
  }

  // Session cookie var mı?
  const session = request.cookies.get(SESSION_COOKIE);
  if (!session) {
    const loginUrl = new URL('/giris', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Session geçerli mi?
  try {
    const payload = JSON.parse(Buffer.from(session.value, 'base64').toString());
    if (payload.exp < Date.now()) {
      const loginUrl = new URL('/giris', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }
  } catch {
    const loginUrl = new URL('/giris', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
