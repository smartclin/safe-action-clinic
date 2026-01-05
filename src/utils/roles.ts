import { getSession } from '@/lib/auth/server';
import type { Role } from '@/types/auth';

/**
 * Check if the current user has a specific role.
 * Better-Auth returns lowercase roles, so we compare lowercase.
 */
export const checkRole = async (role: Role) => {
    const session = await getSession();
    if (!session?.user?.role) return false;

    // Normalize both roles to lowercase for comparison
    const userRole = session.user.role.toLowerCase() as Role;
    return userRole === role.toLowerCase();
};

/**
 * Get the current user's role.
 * Returns lowercase role (admin, doctor, staff, patient) or null if not authenticated.
 * Better-Auth normalizes roles to lowercase in the customSession plugin.
 */
export const getRole = async (): Promise<Role | null> => {
    const session = await getSession();
    if (!session?.user?.role) return null;

    // Normalize to lowercase (Better-Auth returns lowercase)
    const role = session.user.role.toLowerCase() as Role;
    return role || null;
};
