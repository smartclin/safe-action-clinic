type RouteAccessProps = {
    [key: string]: string[];
};

export const createRouteMatcher = (routes: string[]) => {
    const regex = new RegExp(`^(${routes.map(route => route.replace(/\(\.\*\)/, '.*')).join('|')})$`);
    return (pathname: string) => regex.test(pathname);
};

/**
 * Route access configuration.
 * Uses uppercase roles to match database format (ADMIN, DOCTOR, STAFF, PATIENT).
 *
 * Note: 'nurse' and 'lab_technician' are mapped to 'STAFF' role in the database.
 */
export const routeAccess: RouteAccessProps = {
    '/admin(.*)': ['ADMIN'],
    '/patient(.*)': ['PATIENT', 'ADMIN', 'DOCTOR', 'STAFF'],
    '/doctor(.*)': ['DOCTOR'],
    '/staff(.*)': ['STAFF', 'ADMIN', 'DOCTOR'], // STAFF includes nurses, lab technicians, etc.
    '/record/users': ['ADMIN'],
    '/record/doctors': ['ADMIN'],
    '/record/doctors(.*)': ['ADMIN', 'DOCTOR'],
    '/record/staffs': ['ADMIN', 'DOCTOR'],
    '/record/patients': ['ADMIN', 'DOCTOR', 'STAFF'],
    '/record/appointments': ['ADMIN', 'DOCTOR', 'STAFF', 'PATIENT'],
    '/record/medical-records': ['ADMIN', 'DOCTOR', 'STAFF'],
    '/record/billing': ['ADMIN', 'DOCTOR'],
    '/patient/registrations': ['PATIENT']
};

/**
 * Check if a user role has access to a specific route.
 *
 * @param pathname - The route pathname to check
 * @param userRole - The user's role (should be uppercase: ADMIN, DOCTOR, STAFF, PATIENT)
 * @returns true if user has access, false otherwise
 */
export function checkRouteAccess(pathname: string, userRole: string): boolean {
    // Normalize role to uppercase for comparison
    const normalizedRole = userRole.toUpperCase();

    for (const [routePattern, allowedRoles] of Object.entries(routeAccess)) {
        const regex = new RegExp(`^${routePattern.replace(/\(\.\*\)/, '.*')}$`);
        if (regex.test(pathname)) {
            // Check if normalized role is in allowed roles (also normalized)
            return allowedRoles.map(r => r.toUpperCase()).includes(normalizedRole);
        }
    }
    // Allow access if no specific rule matches (default allow)
    return true;
}

// import { createRouteMatcher } from "@clerk/nextjs/server";

// export const routeMatchers = {
//   admin: createRouteMatcher([
//     "/admin(.*)",
//     "/patient(.*)",
//     "/record/users",
//     "/record/doctors(.*)",
//     "/record/patients",
//     "/record/doctors",
//     "/record/staffs",
//     "/record/patients",
//   ]),
//   patient: createRouteMatcher(["/patient(.*)", "/patient/registrations"]),

//   doctor: createRouteMatcher([
//     "/doctor(.*)",
//     "/record/doctors(.*)",
//     "/record/patients",
//     "/patient(.*)",
//     "/record/staffs",
//     "/record/patients",
//   ]),
// };
