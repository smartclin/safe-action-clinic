type RouteAccessProps = {
    [key: string]: string[];
};

export const createRouteMatcher = (routes: string[]) => {
    const regex = new RegExp(`^(${routes.map(route => route.replace(/\(\.\*\)/, '.*')).join('|')})$`);
    return (pathname: string) => regex.test(pathname);
};

export const routeAccess: RouteAccessProps = {
    '/admin(.*)': ['admin'],
    '/patient(.*)': ['patient', 'admin', 'doctor', 'nurse'],
    '/doctor(.*)': ['doctor'],
    '/staff(.*)': ['nurse', 'lab_technician', 'cashier'],
    '/record/users': ['admin'],
    '/record/doctors': ['admin'],
    '/record/doctors(.*)': ['admin', 'doctor'],
    '/record/staffs': ['admin', 'doctor'],
    '/record/patients': ['admin', 'doctor', 'nurse'],
    '/patient/registrations': ['patient']
};

export function checkRouteAccess(pathname: string, userRole: string): boolean {
    for (const [routePattern, allowedRoles] of Object.entries(routeAccess)) {
        const regex = new RegExp(`^${routePattern.replace(/\(\.\*\)/, '.*')}$`);
        if (regex.test(pathname)) {
            return allowedRoles.includes(userRole);
        }
    }
    return true; // Allow access if no specific rule matches
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
