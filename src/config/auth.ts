import type { Route } from 'next';
import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth/server';
import { getRole } from '@/utils/roles';

/**
 * Centralized auth configuration.
 * Single source of truth for role-based redirects.
 */

// Role-based dashboard redirects after login

export async function authRedirectIfNeeded() {
    const session = await getSession();
    if (!session?.user?.id) return;

    const role = await getRole();
    if (role) redirect(`/${role.toLowerCase()}` as Route);
}
