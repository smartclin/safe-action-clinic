import { getSession } from '@/lib/auth/server';
import type { UserRole } from '@/types';

export const checkRole = async (role: UserRole) => {
    const session = await getSession();
    return session?.user?.role === role.toLowerCase();
};

export const getRole = async () => {
    const session = await getSession();

    const role = session?.user.role?.toLowerCase() || 'patient';

    return role;
};
