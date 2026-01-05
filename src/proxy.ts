import { getCookieCache, getSessionCookie } from 'better-auth/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { AUTH_ROUTES, ROLE_REDIRECTS } from '@/config/auth';
import { checkRouteAccess, routeAccess } from '@/lib/routes';

/**
 * Proxy for optimistic route protection (Next.js 16+).
 *
 * IMPORTANT: This is for UX optimization only, NOT security.
 * Cookie checks can be bypassed - always validate sessions
 * in your actual routes using auth.api.getSession().
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 * @see https://www.better-auth.com/docs/integrations/next
 */

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip API routes and static files
    if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
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

    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Role-based route protection (optimistic - for UX only)
    if (isAuthenticated) {
        // Try to get cached session with role
        const cachedSession = await getCookieCache(request);
        const userRole = cachedSession?.user?.role as string | undefined;

        if (userRole) {
            // Check if user has access to the current route
            if (!checkRouteAccess(pathname, userRole)) {
                // Redirect to user's correct dashboard based on role
                const correctDashboard = ROLE_REDIRECTS[userRole as keyof typeof ROLE_REDIRECTS];
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
            const redirectPath = userRole
                ? ROLE_REDIRECTS[userRole as keyof typeof ROLE_REDIRECTS]
                : ROLE_REDIRECTS.PATIENT;
            return NextResponse.redirect(new URL(redirectPath || '/dashboard', request.url));
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
