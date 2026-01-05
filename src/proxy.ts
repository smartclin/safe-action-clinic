import { getCookieCache, getSessionCookie } from 'better-auth/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { AUTH_ROUTES, ROLE_REDIRECTS } from '@/config/auth';
import { checkRouteAccess, routeAccess } from '@/lib/routes';
import type { Role } from '@/types/auth';

/**
 * Proxy for optimistic route protection (Next.js 16+).
 *
 * IMPORTANT: This is for UX optimization only, NOT security.
 * Cookie checks can be bypassed - always validate sessions
 * in your actual routes using auth.api.getSession().
 *
 * This proxy provides:
 * 1. Fast route protection using cookie checks (Edge Runtime compatible)
 * 2. Role-based route access validation
 * 3. Redirects authenticated users away from auth pages
 * 4. Redirects unauthenticated users to login
 *
 * Full security validation happens in layouts using requireAuth() and requireRole().
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 * @see https://www.better-auth.com/docs/integrations/next
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip API routes, Next.js internals, and static files
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.') ||
        pathname.startsWith('/favicon.ico')
    ) {
        return NextResponse.next();
    }

    // Get session cookie (optimistic check - not secure, just for UX)
    const sessionCookie = getSessionCookie(request);
    const isAuthenticated = !!sessionCookie;

    // Check if accessing protected route without session cookie
    const isProtectedRoute = Object.keys(routeAccess).some(routePattern => {
        const regex = new RegExp(`^${routePattern.replace(/\(\.\*\)/, '.*')}$`);
        return regex.test(pathname);
    });

    // Redirect unauthenticated users from protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Role-based route protection (optimistic - for UX only)
    if (isAuthenticated) {
        // Try to get cached session with role
        const cachedSession = await getCookieCache(request);
        const userRole = cachedSession?.user?.role as Role | undefined;

        if (userRole) {
            // Normalize role to uppercase (roles are stored as uppercase in DB)
            const normalizedRole = userRole.toUpperCase() as Role;

            // Check if user has access to the current route
            if (!checkRouteAccess(pathname, normalizedRole)) {
                // Redirect to user's correct dashboard based on role
                const correctDashboard = ROLE_REDIRECTS[normalizedRole];
                if (correctDashboard) {
                    return NextResponse.redirect(new URL(correctDashboard, request.url));
                }
                // Fallback redirect
                return NextResponse.redirect(new URL('/unauthorized', request.url));
            }
        }

        // Redirect authenticated users away from auth pages
        const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
        if (isAuthRoute) {
            const userRole = cachedSession?.user?.role as Role | undefined;
            const normalizedRole = userRole ? (userRole.toUpperCase() as Role) : 'PATIENT';
            const redirectPath = ROLE_REDIRECTS[normalizedRole] || ROLE_REDIRECTS.PATIENT;
            return NextResponse.redirect(new URL(redirectPath, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)'
    ]
};
