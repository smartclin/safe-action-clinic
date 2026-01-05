import {
    Bell,
    LayoutDashboard,
    List,
    ListOrdered,
    Logs,
    type LucideIcon,
    Pill,
    Receipt,
    Settings,
    SquareActivity,
    User,
    UserRound,
    Users,
    UsersRound
} from 'lucide-react';
import Link from 'next/link';

import { getRole } from '@/utils/roles';

import { LogoutButton } from './logout-button';

// Access levels use uppercase to match database role format (ADMIN, DOCTOR, STAFF, PATIENT)
// Note: 'nurse' and 'lab technician' are mapped to 'STAFF' role
const ACCESS_LEVELS_ALL = ['ADMIN', 'DOCTOR', 'STAFF', 'PATIENT'];

const SidebarIcon = ({ icon: Icon }: { icon: LucideIcon }) => {
    return <Icon className='size-6 lg:size-5' />;
};

export const Sidebar = async () => {
    const role = await getRole();
    // Normalize role to uppercase for comparison with access arrays
    // (access arrays use uppercase to match database format)
    const normalizedRole = role?.toUpperCase();

    const SIDEBAR_LINKS = [
        {
            label: 'MENU',
            links: [
                {
                    name: 'Dashboard',
                    href: '/',
                    access: ACCESS_LEVELS_ALL,
                    icon: LayoutDashboard
                },
                {
                    name: 'Profile',
                    href: '/patient/self',
                    access: ['PATIENT'],
                    icon: User
                }
            ]
        },
        {
            label: 'Manage',
            links: [
                {
                    name: 'Users',
                    href: '/record/users',
                    access: ['ADMIN'],
                    icon: Users
                },
                {
                    name: 'Doctors',
                    href: '/record/doctors',
                    access: ['ADMIN'],
                    icon: User
                },
                {
                    name: 'Staffs',
                    href: '/record/staffs',
                    access: ['ADMIN', 'DOCTOR'],
                    icon: UserRound
                },
                {
                    name: 'Patients',
                    href: '/record/patients',
                    access: ['ADMIN', 'DOCTOR', 'STAFF'],
                    icon: UsersRound
                },
                {
                    name: 'Appointments',
                    href: '/record/appointments',
                    access: ['ADMIN', 'DOCTOR', 'STAFF'],
                    icon: ListOrdered
                },
                {
                    name: 'Medical Records',
                    href: '/record/medical-records',
                    access: ['ADMIN', 'DOCTOR', 'STAFF'],
                    icon: SquareActivity
                },
                {
                    name: 'Billing Overview',
                    href: '/record/billing',
                    access: ['ADMIN', 'DOCTOR'],
                    icon: Receipt
                },
                {
                    name: 'Patient Management',
                    href: '/nurse/patient-management',
                    access: ['STAFF'],
                    icon: Users
                },
                {
                    name: 'Administer Medications',
                    href: '/nurse/administer-medications',
                    access: ['ADMIN', 'DOCTOR', 'STAFF'],
                    icon: Pill
                },
                {
                    name: 'Appointments',
                    href: '/record/appointments',
                    access: ['PATIENT'],
                    icon: ListOrdered
                },
                {
                    name: 'Records',
                    href: '/patient/self',
                    access: ['PATIENT'],
                    icon: List
                },
                {
                    name: 'Prescription',
                    href: '#',
                    access: ['PATIENT'],
                    icon: Pill
                },
                {
                    name: 'Billing',
                    href: '/patient/self?cat=payments',
                    access: ['PATIENT'],
                    icon: Receipt
                }
            ]
        },
        {
            label: 'System',
            links: [
                {
                    name: 'Notifications',
                    href: '/notifications',
                    access: ACCESS_LEVELS_ALL,
                    icon: Bell
                },
                {
                    name: 'Audit Logs',
                    href: '/admin/audit-logs',
                    access: ['ADMIN'],
                    icon: Logs
                },
                {
                    name: 'Settings',
                    href: '/admin/system-settings',
                    access: ['ADMIN'],
                    icon: Settings
                }
            ]
        }
    ];

    return (
        <div className='flex min-h-full w-full flex-col justify-between gap-4 overflow-y-scroll bg-white p-4'>
            <div className=''>
                <div className='flex items-center justify-center gap-2 lg:justify-start'>
                    <div className='rounded-md bg-blue-600 p-1.5 text-white'>
                        <SquareActivity size={22} />
                    </div>
                    <Link
                        className='hidden font-bold text-base lg:flex 2xl:text-xl'
                        href={'/'}
                    >
                        Kinda HMS
                    </Link>
                </div>

                <div className='mt-4 text-sm'>
                    {SIDEBAR_LINKS.map(el => (
                        <div
                            className='flex flex-col gap-2'
                            key={el.label}
                        >
                            <span className='my-4 hidden font-bold text-gray-400 uppercase lg:block'>{el.label}</span>

                            {el.links
                                .filter(link => normalizedRole && link.access.includes(normalizedRole))
                                .map(link => (
                                    <Link
                                        className='flex items-center justify-center gap-4 rounded-md py-2 text-gray-500 hover:bg-blue-600/10 md:px-2 lg:justify-start'
                                        href={link.href}
                                        key={link.name}
                                    >
                                        <SidebarIcon icon={link.icon} />
                                        <span className='hidden lg:block'>{link.name}</span>
                                    </Link>
                                ))}
                        </div>
                    ))}
                </div>
            </div>

            <LogoutButton />
        </div>
    );
};
