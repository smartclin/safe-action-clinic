import 'server-only';

import type { Route } from 'next';
import { redirect } from 'next/navigation';
import { cache } from 'react';

import { auth } from '@/lib/auth';
import { getRoleRedirect } from '@/lib/routes';
import type { Role } from '@/types/auth';

/* ----------------------------------------
   Role hierarchy (IMPORTANT)
---------------------------------------- */
const ROLE_ORDER: Role[] = ['patient', 'staff', 'doctor', 'admin'];

function hasAccess(userRole: Role, requiredRole: Role) {
    return ROLE_ORDER.indexOf(userRole) >= ROLE_ORDER.indexOf(requiredRole);
}

/* ----------------------------------------
   Session (single source of truth)
---------------------------------------- */
export const getSession = cache(async () => {
    try {
        // ✅ DO NOT pass headers – Next handles cookies automatically
        return await auth.api.getSession();
    } catch (error) {
        console.error('Failed to get session:', error);
        return null;
    }
});

/* ----------------------------------------
   User helpers
---------------------------------------- */
export async function getUser() {
    const session = await getSession();
    return session?.user ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
    return !!(await getSession());
}

/* ----------------------------------------
   Auth guards
---------------------------------------- */
export async function requireAuth(requiredRole?: Role) {
    const session = await getSession();

    if (!session?.user) {
        redirect('/login');
    }

    if (requiredRole) {
        const userRole = (session.user.role ?? 'patient') as Role;

        if (!hasAccess(userRole, requiredRole)) {
            redirect(getRoleRedirect(userRole) as Route);
        }
    }

    return session;
}

export async function requireRole(
    role: Role,
    options?: {
        redirectTo?: Route;
        roleRedirectTo?: Route;
    }
) {
    const session = await getSession();

    if (!session?.user) {
        redirect(options?.redirectTo ?? '/login');
    }

    const userRole = (session.user.role ?? 'patient') as Role;

    if (!hasAccess(userRole, role)) {
        redirect(options?.roleRedirectTo ?? (getRoleRedirect(userRole) as Route));
    }

    return session;
}

/* ----------------------------------------
   Role checks (no redirect)
---------------------------------------- */
export async function hasRole(role: Role | Role[]): Promise<boolean> {
    const session = await getSession();
    if (!session?.user) return false;

    const userRole = (session.user.role ?? 'patient') as Role;
    const roles = Array.isArray(role) ? role : [role];

    return roles.some(r => hasAccess(userRole, r));
}

/* ----------------------------------------
   Role redirect helper
---------------------------------------- */
export function getRoleRedirectPath(role?: Role | string): string {
    if (!role) return '/dashboard';

    const redirects: Record<Role, string> = {
        admin: '/admin/dashboard',
        doctor: '/doctor',
        staff: '/staff',
        patient: '/patient'
    };

    return redirects[role as Role] ?? '/dashboard';
}
