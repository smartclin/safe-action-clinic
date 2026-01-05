import 'server-only';

import type { Route } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getRoleRedirect } from '@/config/auth';
import type { Role } from '@/types/auth';

import { auth } from '.';

/**
 * Get the current session on the server.
 * Use this in Server Components and Server Actions.
 *
 * @example
 * // In a Server Component
 * const session = await getServerSession()
 * if (!session) redirect('/login')
 */
export async function getSession() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    return session;
}

/**
 * Get the current user on the .
 * Returns null if not authenticated.
 */
export async function getUser() {
    const session = await getSession();
    return session?.user ?? null;
}

/**
 * Require authentication on a server page/action.
 * Redirects to login if not authenticated.
 *
 * @example
 * // In a Server Component
 * export default async function ProtectedPage() {
 *   const session = await requireAuth()
 *   return <div>Hello {session.user.name}</div>
 * }
 */
export async function requireAuth(redirectTo = '/login') {
    const session = await getSession();

    if (!session) {
        redirect(redirectTo as Route);
    }

    return session;
}

/**
 * Require a specific role on a server page/action.
 * Redirects if not authenticated or wrong role.
 *
 * @example
 * // In an Admin Server Component
 * export default async function AdminPage() {
 *   const session = await requireRole('ADMIN')
 *   return <div>Admin Panel</div>
 * }
 */
export async function requireRole(
    role: Role,
    options?: {
        redirectTo?: Route;
        roleRedirectTo?: Route;
    }
) {
    const session = await getSession();

    if (!session) {
        redirect(options?.redirectTo ?? ('/login' as Route));
    }

    const userRole = (session.user as { role?: Role }).role;

    if (userRole !== role) {
        // Redirect to appropriate dashboard based on actual role
        const defaultRedirect = getRoleRedirect(userRole);
        redirect(options?.roleRedirectTo ?? (defaultRedirect as Route));
    }

    return session;
}

/**
 * Check if the current user has a specific role.
 * Does not redirect - just returns boolean.
 */
export async function hasRole(role: Role): Promise<boolean> {
    const session = await getSession();
    if (!session) return false;

    const userRole = (session.user as { role?: Role }).role;
    return userRole === role;
}

/**
 * Check if the current user is authenticated.
 * Does not redirect - just returns boolean.
 */
export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session;
}
