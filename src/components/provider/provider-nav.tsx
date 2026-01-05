'use client';

import {
    Bell,
    Bug,
    Code2,
    FileText,
    GitBranch,
    GitPullRequest,
    HelpCircle,
    LayoutDashboard,
    Package,
    Settings,
    User,
    Users
} from 'lucide-react';

import type { NavSection } from '@/components/dashboard';

export const providerNavSections: NavSection[] = [
    {
        title: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: '/admin/dashboard',
                icon: LayoutDashboard
            },
            {
                title: 'Pull Requests',
                href: '/dashboard/pulls',
                icon: GitPullRequest,
                badge: 3
            },
            {
                title: 'Issues',
                href: '/dashboard/issues',
                icon: Bug,
                badge: 2
            }
        ]
    },
    {
        title: 'Development',
        items: [
            {
                title: 'Components',
                href: '/dashboard/components',
                icon: Code2
            },
            {
                title: 'Packages',
                href: '/dashboard/packages',
                icon: Package
            },
            {
                title: 'Branches',
                href: '/dashboard/branches',
                icon: GitBranch
            }
        ]
    },
    {
        title: 'Team',
        items: [
            {
                title: 'Members',
                href: '/dashboard/team',
                icon: Users
            },
            {
                title: 'Documentation',
                href: '/dashboard/docs',
                icon: FileText
            }
        ]
    },
    {
        title: 'Account',
        items: [
            {
                title: 'Notifications',
                href: '/dashboard/notifications',
                icon: Bell,
                badge: 5
            },
            {
                title: 'Profile',
                href: '/dashboard/profile',
                icon: User
            },
            {
                title: 'Settings',
                href: '/dashboard/settings',
                icon: Settings
            },
            {
                title: 'Help & Support',
                href: '/dashboard/help',
                icon: HelpCircle
            }
        ]
    }
];
