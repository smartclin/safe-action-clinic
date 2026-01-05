'use client';

import type { LucideIcon } from 'lucide-react';
import {
    Activity,
    Baby,
    Calendar,
    ChevronLeft,
    ChevronRight,
    FileText,
    HeartPulse,
    Home,
    Loader2,
    LogOut,
    Pill,
    Settings,
    Stethoscope,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';
import { cn } from '@/lib/utils';

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
    badge?: string | number;
    badgeVariant?: string;
    roles?: string[];
    description?: string;
}

export interface NavSection {
    title?: string;
    items: NavItem[];
}

interface SidebarProps {
    clinicName?: string;
}

export function Sidebar({ clinicName = 'Pediatric Clinic' }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const { user, signOut, isLoading } = useAuth();

    const sections: NavSection[] = [
        {
            items: [
                { title: 'Dashboard', href: '/dashboard', icon: Home },
                { title: 'Patients', href: '/patients', icon: Baby, badge: '12+' },
                { title: 'Appointments', href: '/appointments', icon: Calendar, badge: '3' },
                { title: 'Doctors', href: '/doctors', icon: Stethoscope }
            ]
        },
        {
            title: 'Medical',
            items: [
                { title: 'Medical Records', href: '/medical-records', icon: FileText },
                { title: 'Prescriptions', href: '/prescriptions', icon: Pill },
                { title: 'Immunizations', href: '/immunizations', icon: HeartPulse },
                { title: 'Growth Charts', href: '/growth-charts', icon: Activity }
            ]
        },
        {
            title: 'Administration',
            items: [
                { title: 'Staff', href: '/staff', icon: Users, roles: ['ADMIN', 'MANAGER'] },
                { title: 'Settings', href: '/settings', icon: Settings, roles: ['ADMIN'] }
            ]
        }
    ];

    // Filter items based on user role
    const filteredSections = sections
        .map(section => ({
            ...section,
            items: section.items.filter(item => !item.roles || (user?.role && item.roles.includes(user.role)))
        }))
        .filter(section => section.items.length > 0);

    return (
        <aside
            className={cn(
                'sticky top-0 flex h-screen flex-col border-border border-r bg-card/50 backdrop-blur-sm transition-all duration-300',
                isCollapsed ? 'w-16' : 'w-64'
            )}
        >
            {/* Header with Clinic Info */}
            <div className='flex h-20 items-center justify-between border-border border-b px-4'>
                <Link
                    className={cn(
                        'flex items-center gap-3 transition-opacity hover:opacity-80',
                        isCollapsed && 'pointer-events-none opacity-0'
                    )}
                    href='/dashboard'
                >
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-primary to-violet-500 text-primary-foreground shadow-lg'>
                        <Baby className='h-5 w-5' />
                    </div>
                    <div className='space-y-1'>
                        <h1 className='font-bold text-lg leading-none'>{clinicName}</h1>
                        <p className='text-muted-foreground text-xs'>Pediatric Care</p>
                    </div>
                </Link>
                <Button
                    className='h-8 w-8 shrink-0'
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    size='icon-sm'
                    variant='ghost'
                >
                    {isCollapsed ? <ChevronRight className='h-4 w-4' /> : <ChevronLeft className='h-4 w-4' />}
                </Button>
            </div>

            {/* Clinic Quick Stats - Only visible when expanded */}
            {!isCollapsed && (
                <div className='border-border border-b p-4'>
                    <div className='grid grid-cols-2 gap-2'>
                        <div className='rounded-lg bg-primary/5 p-2 text-center'>
                            <p className='font-bold text-lg'>24</p>
                            <p className='text-muted-foreground text-xs'>Today</p>
                        </div>
                        <div className='rounded-lg bg-violet-500/5 p-2 text-center'>
                            <p className='font-bold text-lg'>3</p>
                            <p className='text-muted-foreground text-xs'>Due</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className='flex-1 overflow-y-auto p-3'>
                <div className='space-y-4'>
                    {filteredSections.map(section => (
                        <div key={section.title || 'main'}>
                            {section.title && !isCollapsed && (
                                <h4 className='mb-2 px-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider'>
                                    {section.title}
                                </h4>
                            )}
                            <ul className='space-y-1'>
                                {section.items.map(item => {
                                    const Icon = item.icon;
                                    const isActive = pathname.startsWith(item.href);

                                    return (
                                        <li key={item.href}>
                                            <Link
                                                className={cn(
                                                    'group flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-sm transition-all hover:bg-accent',
                                                    isActive
                                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                                        : 'text-muted-foreground hover:text-foreground',
                                                    isCollapsed && 'justify-center px-2'
                                                )}
                                                href={item.href}
                                                title={isCollapsed ? item.title : undefined}
                                            >
                                                <div className='relative'>
                                                    <Icon className='h-4 w-4 shrink-0' />
                                                    {!isCollapsed && item.badge && (
                                                        <span className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-xs'>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {!isCollapsed && (
                                                    <>
                                                        <span className='flex-1'>{item.title}</span>
                                                        {item.description && (
                                                            <span className='text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100'>
                                                                {item.description}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </nav>

            {/* User Profile & Logout */}
            <div className='border-border border-t p-4'>
                <div className={cn('mb-3 flex items-center gap-3', isCollapsed && 'justify-center')}>
                    <Avatar className={cn('h-8 w-8 ring-2 ring-border', isCollapsed && 'h-10 w-10')}>
                        <AvatarImage src={user?.image || ''} />
                        <AvatarFallback className='bg-linear-to-br from-primary/20 to-violet-500/20'>
                            {user?.name
                                ?.split(' ')
                                .map(n => n[0])
                                .join('')
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {!isCollapsed && (
                        <div className='min-w-0 flex-1'>
                            <p className='truncate font-medium text-sm'>{user?.name}</p>
                            <Badge
                                className='font-normal text-xs'
                                variant='secondary'
                            >
                                {user?.role}
                            </Badge>
                        </div>
                    )}
                </div>

                <Button
                    className={cn(
                        'w-full justify-start gap-3 text-muted-foreground hover:text-foreground',
                        isCollapsed && 'justify-center px-2'
                    )}
                    disabled={isLoading}
                    onClick={signOut}
                    size={isCollapsed ? 'icon' : 'default'}
                    variant='ghost'
                >
                    {isLoading ? (
                        <Loader2 className='h-4 w-4 shrink-0 animate-spin' />
                    ) : (
                        <LogOut className='h-4 w-4 shrink-0' />
                    )}
                    {!isCollapsed && <span>Sign Out</span>}
                </Button>
            </div>
        </aside>
    );
}
