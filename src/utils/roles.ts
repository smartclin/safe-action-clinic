import { getSession } from '@/lib/auth/server';
import type { UserRole } from '@/types';

/**
 * Check if the current user has a specific role.
 * Roles are stored as uppercase in the database (ADMIN, DOCTOR, STAFF, PATIENT).
 */
export const checkRole = async (role: UserRole) => {
    const session = await getSession();
    // Compare with uppercase since roles are stored as uppercase
    return session?.user?.role === role.toUpperCase();
};

/**
 * Get the current user's role.
 * Returns uppercase role (ADMIN, DOCTOR, STAFF, PATIENT) or null if not authenticated.
 */
export const getRole = async (): Promise<UserRole | null> => {
    const session = await getSession();
    const role = session?.user?.role as UserRole | undefined;
    return role || null;
};
