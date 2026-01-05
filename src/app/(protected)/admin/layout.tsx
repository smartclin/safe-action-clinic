import type { Route } from 'next';
import { redirect } from 'next/navigation';
import type React from 'react';

import { requireRole } from '@/lib/auth/server';

/**
 * Admin Layout - Server Component
 * 
 * This layout:
 * 1. Requires ADMIN role (redirects non-admins to their dashboard)
 * 2. Provides admin-specific layout if needed
 * 3. All routes under /admin inherit this role check
 * 
 * @example
 * // All pages under /admin automatically require ADMIN role
 * // /admin/dashboard, /admin/settings, etc.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // Require ADMIN role - redirects if not admin
    await requireRole('ADMIN', {
        redirectTo: '/login',
        roleRedirectTo: '/dashboard' // Redirect non-admins to their dashboard
    });

    return <>{children}</>;
}

