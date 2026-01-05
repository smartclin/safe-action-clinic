import { getSessionCookie } from 'better-auth/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { AUTH_ROUTES, PUBLIC_ROUTES, ROLE_REDIRECTS } from '@/lib/routes';
import type { Role } from '@/types/auth';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    /* ----------------------------------------
     1. Ignore static & API & Next.js internals
  ---------------------------------------- */
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/public') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    /* ----------------------------------------
     2. Authenticated status check (Fast)
  ---------------------------------------- */
    const sessionCookie = getSessionCookie(request);
    const isAuthenticated = Boolean(sessionCookie);

    /* ----------------------------------------
     3. Public routes logic
  ---------------------------------------- */
    const isPublic = PUBLIC_ROUTES.some(route => (route === '/' ? pathname === '/' : pathname.startsWith(route)));

    if (isPublic) {
        // Authenticated user on auth page -> redirect to their role-specific home
        if (isAuthenticated && AUTH_ROUTES.some(route => pathname.startsWith(route))) {
            const session = await auth.api.getSession({ headers: request.headers });
            if (session?.user) {
                const role = (session.user.role?.toLowerCase() as Role) || 'patient';
                const redirectUrl = ROLE_REDIRECTS[role] || ROLE_REDIRECTS.patient;
                return NextResponse.redirect(new URL(redirectUrl, request.url));
            }
        }
        return NextResponse.next();
    }

    /* ----------------------------------------
     4. Protected routes check
  ---------------------------------------- */
    if (!isAuthenticated) {
        const loginUrl = new URL('/login', request.url);

        // Preserve callback ONLY for non-auth routes
        if (!AUTH_ROUTES.some(route => pathname.startsWith(route))) {
            loginUrl.searchParams.set('callbackUrl', pathname);
        }

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

/* ----------------------------------------
   Matcher (simple & safe)
---------------------------------------- */
export const config = {
    matcher: ['/((?!api|_next|favicon.ico).*)']
};
