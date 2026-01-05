import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { routeAccess } from '@/lib/routes';

const AUTH_ROUTES = ['/login', '/register', '/register-provider'];
const DEFAULT_LOGIN = '/login';

export async function proxy(request: NextRequest) {
    const { pathname, origin } = request.nextUrl;

    // 1️⃣ Allow public auth routes
    if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // 2️⃣ Get session
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // 3️⃣ No session → redirect to login (but avoid loop)
    if (!session) {
        if (pathname !== DEFAULT_LOGIN) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN, origin));
        }
        return NextResponse.next();
    }

    const role = session.user.role;

    // 4️⃣ Check route access
    const matchingRoute = Object.entries(routeAccess).find(([pattern]) => new RegExp(pattern).test(pathname));

    if (matchingRoute && !matchingRoute[1].includes(role)) {
        const redirectTo = getRoleHome(role);

        // 🚫 prevent self-redirect
        if (pathname !== redirectTo) {
            return NextResponse.redirect(new URL(redirectTo, origin));
        }
    }

    return NextResponse.next();
}

/**
 * Explicit role → route mapping
 * NEVER redirect to `/${role}` blindly
 */
function getRoleHome(role: string) {
    switch (role) {
        case 'admin':
            return '/admin/dashboard';
        case 'doctor':
            return '/doctor';
        case 'patient':
            return '/patient';
        default:
            return DEFAULT_LOGIN;
    }
}

export const config = {
    matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)']
};
