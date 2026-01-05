'use client';

import {
    Baby,
    BarChart3,
    Bell,
    BellRing,
    Building,
    Calendar,
    ClipboardList,
    CreditCard,
    Database,
    DollarSign,
    FileBarChart,
    FileCheck,
    FileText,
    HeartPulse,
    HelpCircle,
    LayoutDashboard,
    Lock,
    MessageSquare,
    Monitor,
    Pill,
    Server,
    Settings,
    Shield,
    ShieldCheck,
    Stethoscope,
    TrendingUp,
    UserCog,
    Users,
    Users2,
    Video
} from 'lucide-react';

import type { NavSection } from '@/components/dashboard';

export const adminNavSections: NavSection[] = [
    {
        title: 'Dashboard',
        items: [
            {
                title: 'Overview',
                href: '/admin/dashboard',
                icon: LayoutDashboard,
                description: 'Clinic operations dashboard'
            },
            {
                title: 'Analytics',
                href: '/admin/analytics',
                icon: BarChart3,
                description: 'Performance metrics and reports'
            },
            {
                title: 'Real-time Monitor',
                href: '/admin/monitor',
                icon: Monitor,
                badge: 3,
                badgeVariant: 'blue',
                description: 'Live clinic operations'
            }
        ]
    },
    {
        title: 'Clinic Management',
        items: [
            {
                title: 'Providers',
                href: '/admin/providers',
                icon: Stethoscope,
                badge: 2,
                badgeVariant: 'amber',
                description: 'Medical staff management'
            },
            {
                title: 'Patients',
                href: '/admin/patients',
                icon: Users,
                description: 'Patient database and records'
            },
            {
                title: 'Appointments',
                href: '/admin/appointments',
                icon: Calendar,
                description: 'Schedule and booking management'
            },
            {
                title: 'Clinical Staff',
                href: '/admin/staff',
                icon: Users2,
                description: 'Nurses and support staff'
            },
            {
                title: 'Clinic Settings',
                href: '/admin/clinic-settings',
                icon: Building,
                description: 'Clinic configuration'
            }
        ]
    },
    {
        title: 'Clinical Operations',
        items: [
            {
                title: 'Medical Records',
                href: '/admin/medical-records',
                icon: FileText,
                description: 'Patient health records'
            },
            {
                title: 'Prescriptions',
                href: '/admin/prescriptions',
                icon: Pill,
                badge: 5,
                badgeVariant: 'red',
                description: 'Medication management'
            },
            {
                title: 'Immunizations',
                href: '/admin/immunizations',
                icon: HeartPulse,
                description: 'Vaccine inventory and schedule'
            },
            {
                title: 'Lab Results',
                href: '/admin/lab-results',
                icon: ClipboardList,
                description: 'Laboratory test management'
            },
            {
                title: 'Referrals',
                href: '/admin/referrals',
                icon: FileCheck,
                description: 'Specialist referrals'
            },
            {
                title: 'Growth Charts',
                href: '/admin/growth-charts',
                icon: TrendingUp,
                description: 'Child development tracking'
            }
        ]
    },
    {
        title: 'Financial & Billing',
        items: [
            {
                title: 'Billing',
                href: '/admin/billing',
                icon: DollarSign,
                description: 'Invoicing and payments'
            },
            {
                title: 'Insurance',
                href: '/admin/insurance',
                icon: ShieldCheck,
                description: 'Insurance management'
            },
            {
                title: 'Revenue Reports',
                href: '/admin/revenue-reports',
                icon: FileBarChart,
                description: 'Financial analytics'
            },
            {
                title: 'Payment Processing',
                href: '/admin/payments',
                icon: CreditCard,
                description: 'Payment gateway management'
            },
            {
                title: 'Claims Management',
                href: '/admin/claims',
                icon: FileText,
                description: 'Insurance claims processing'
            }
        ]
    },
    {
        title: 'Administrative',
        items: [
            {
                title: 'User Management',
                href: '/record/users',
                icon: UserCog,
                description: 'User accounts and permissions'
            },
            {
                title: 'Audit Logs',
                href: '/admin/audit-logs',
                icon: Database,
                description: 'System activity tracking'
            },
            {
                title: 'Inventory',
                href: '/admin/inventory',
                icon: ClipboardList,
                description: 'Medical supplies tracking'
            },
            {
                title: 'Compliance',
                href: '/admin/compliance',
                icon: Shield,
                description: 'Regulatory compliance'
            },
            {
                title: 'Telehealth',
                href: '/admin/telehealth',
                icon: Video,
                description: 'Virtual care management'
            }
        ]
    },
    {
        title: 'System & Security',
        items: [
            {
                title: 'Security',
                href: '/admin/security',
                icon: Lock,
                description: 'Security settings and monitoring'
            },
            {
                title: 'Infrastructure',
                href: '/admin/infrastructure',
                icon: Server,
                description: 'System infrastructure'
            },
            {
                title: 'Backup & Recovery',
                href: '/admin/backup',
                icon: Database,
                description: 'Data backup management'
            },
            {
                title: 'API Management',
                href: '/admin/api',
                icon: Server,
                description: 'API configuration'
            },
            {
                title: 'System Health',
                href: '/admin/health',
                icon: HeartPulse,
                description: 'System performance monitoring'
            }
        ]
    },
    {
        title: 'Communication',
        items: [
            {
                title: 'Alerts & Notifications',
                href: '/admin/alerts',
                icon: BellRing,
                badge: 8,
                badgeVariant: 'red',
                description: 'Critical alerts management'
            },
            {
                title: 'Messaging',
                href: '/admin/messaging',
                icon: MessageSquare,
                description: 'Internal and patient messaging'
            },
            {
                title: 'Announcements',
                href: '/admin/announcements',
                icon: Bell,
                description: 'Clinic announcements'
            },
            {
                title: 'Patient Portal',
                href: '/admin/patient-portal',
                icon: Baby,
                description: 'Portal configuration'
            },
            {
                title: 'Provider Portal',
                href: '/admin/provider-portal',
                icon: Stethoscope,
                description: 'Provider portal settings'
            }
        ]
    },
    {
        title: 'Account',
        items: [
            {
                title: 'Notifications',
                href: '/admin/notifications',
                icon: Bell,
                badge: 12,
                badgeVariant: 'blue',
                description: 'Personal notifications'
            },
            {
                title: 'Profile',
                href: '/admin/profile',
                icon: UserCog,
                description: 'Admin profile settings'
            },
            {
                title: 'System Settings',
                href: '/admin/system-settings',
                icon: Settings,
                description: 'Global system settings'
            },
            {
                title: 'Help & Support',
                href: '/admin/help',
                icon: HelpCircle,
                description: 'Documentation and support'
            }
        ]
    }
];

// Additional utility for badge variant types
export type BadgeVariant = 'default' | 'blue' | 'red' | 'amber' | 'emerald' | 'purple' | 'cyan';

// Optional: Navigation item type extension
export interface NavItemWithDescription {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
    badge?: number;
    badgeVariant?: BadgeVariant;
    disabled?: boolean;
}
