// middleware.ts (or proxy.ts)
import { getSessionCookie } from 'better-auth/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { AUTH_ROUTES, PUBLIC_ROUTES, ROLE_REDIRECTS } from '@/lib/routes';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    /* ----------------------------------------
     Ignore static & API
  ---------------------------------------- */
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
        return NextResponse.next();
    }

    /* ----------------------------------------
     Public routes
  ---------------------------------------- */
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    const sessionCookie = getSessionCookie(request);
    const isAuthenticated = Boolean(sessionCookie);

    /* ----------------------------------------
     Not authenticated → redirect to login
  ---------------------------------------- */
    if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);

        // Preserve callback ONLY for non-auth routes
        if (!AUTH_ROUTES.some(route => pathname.startsWith(route))) {
            loginUrl.searchParams.set('callbackUrl', pathname);
        }

        return NextResponse.redirect(loginUrl);
    }

    /* ----------------------------------------
     Authenticated user on auth pages
  ---------------------------------------- */
    if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
        // ⚠️ Do NOT read role here — server will handle it
        return NextResponse.redirect(new URL(ROLE_REDIRECTS.patient, request.url));
    }

    return NextResponse.next();
}

/* ----------------------------------------
   Matcher (simple & safe)
---------------------------------------- */
export const config = {
    matcher: ['/((?!api|_next|favicon.ico).*)']
};
