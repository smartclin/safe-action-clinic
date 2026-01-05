import { createAccessControl } from 'better-auth/plugins/access';

import type { auth } from '.';

// Define access control statement
const statement = {
    patients: ['create', 'read', 'update', 'delete', 'list'],
    appointments: ['create', 'read', 'update', 'delete', 'list'],
    records: ['create', 'read', 'update', 'delete', 'list'],
    staff: ['create', 'read', 'update', 'delete', 'list'],
    payments: ['create', 'read', 'update', 'delete', 'list']
} as const;

// Create access controller
const ac = createAccessControl(statement);

// Define roles with Better Auth access control
export const adminRole = ac.newRole({
    patients: ['create', 'read', 'update', 'delete', 'list'],
    appointments: ['create', 'read', 'update', 'delete', 'list'],
    records: ['create', 'read', 'update', 'delete', 'list'],
    staff: ['create', 'read', 'update', 'delete', 'list'],
    payments: ['create', 'read', 'update', 'delete', 'list']
});

export const doctorRole = ac.newRole({
    patients: ['read', 'update', 'list'],
    appointments: ['create', 'read', 'update', 'list'],
    records: ['create', 'read', 'update', 'list'],
    payments: ['read', 'list'],
    staff: []
});

export const staffRole = ac.newRole({
    patients: ['read', 'list'],
    appointments: ['create', 'read', 'update', 'list'],
    records: ['read', 'list'],
    staff: [],
    payments: ['create', 'read', 'list']
});

export const patientRole = ac.newRole({
    appointments: ['create', 'read'],
    records: ['read'],
    staff: [],
    patients: [],
    payments: ['read']
});
// Use the proper Better Auth session type that includes user
type BetterAuthSession = typeof auth.$Infer.Session | null;
export type UserRoles = 'admin' | 'patient' | 'staff' | 'doctor';
// Role checking utilities
export const checkRole = (session: BetterAuthSession, roleToCheck: UserRoles): boolean => {
    if (!session?.user?.role) {
        return false;
    }

    // Handle multiple roles (comma-separated)
    const userRoles = session.user.role.split(',').map((r: string) => r.trim().toLowerCase());
    return userRoles.includes(roleToCheck.toLowerCase());
};
export const getRole = (session: BetterAuthSession): UserRoles => {
    const roleString = session?.user?.role?.toLowerCase();

    if (!roleString) {
        return 'patient';
    }

    // Get first role if multiple roles exist
    const primaryRole = roleString.split(',')[0]?.trim();

    switch (primaryRole) {
        case 'admin':
        case 'doctor':
        case 'staff':
        case 'patient':
            return primaryRole as UserRoles;
        default:
            return 'patient';
    }
};

// Permission checking with Better Auth access control
export const hasPermission = (
    session: BetterAuthSession,
    resource: keyof typeof statement,
    action: string
): boolean => {
    if (!session?.user?.role) {
        return false;
    }
    const role = getRole(session);

    const roleMap = {
        admin: adminRole,
        doctor: doctorRole,
        staff: staffRole,
        patient: patientRole
    } as const;

    const rolePermissions = roleMap[role];

    // rolePermissions is now correctly typed

    const resourcePermissions = rolePermissions.statements[resource];
    return resourcePermissions ? resourcePermissions.includes(action as never) : false;
};

// Optimized getter utilities
export const getUser = (session: BetterAuthSession) => session?.user ?? null;
export const getUserId = (session: BetterAuthSession) => session?.user?.id ?? null;
export const getUserEmail = (session: BetterAuthSession) => session?.user?.email ?? null;
export const getUserName = (session: BetterAuthSession) => session?.user?.name ?? null;
export const getUserRole = (session: BetterAuthSession) => session?.user?.role ?? null;

// Memoized role checker
export const createRoleChecker = (session: BetterAuthSession) => {
    const userRole = getRole(session);

    return {
        role: userRole,
        isAdmin: userRole === 'admin',
        isDoctor: userRole === 'doctor',
        isStaff: userRole === 'staff',
        isPatient: userRole === 'patient',

        // Permission checkers
        canManagePatients: hasPermission(session, 'patients', 'update'),
        canCreateAppointments: hasPermission(session, 'appointments', 'create'),
        canViewRecords: hasPermission(session, 'records', 'read'),
        canManageStaff: hasPermission(session, 'staff', 'update'),

        hasPermission: (resource: keyof typeof statement, action: string) => hasPermission(session, resource, action)
    };
};

// Dashboard access control
export const canAccessDashboard = (session: BetterAuthSession): boolean => {
    const role = getRole(session);
    return ['admin', 'doctor', 'staff'].includes(role);
};

// Export for use in auth configuration
export { ac, statement };
export const allRoles = {
    admin: adminRole,
    doctor: doctorRole,
    staff: staffRole,
    patient: patientRole
};
