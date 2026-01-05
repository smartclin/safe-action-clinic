'use client';

import {
    AlertTriangle,
    BarChart3,
    Bell,
    Building,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    DollarSign,
    HeartPulse,
    Pill,
    Settings,
    Stethoscope,
    Users,
    Users2
} from 'lucide-react';
import type Route from 'next';
import Link from 'next/link';

import {
    ActivityFeed,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    DataTable,
    StatsCard,
    StatsGrid
} from '@/components/dashboard';
import type { ActivityItem } from '@/components/dashboard/activity-feed';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

// Mock data for pediatric clinic admin
const recentProviders = [
    {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah@smartclinic.com',
        specialty: 'Pediatrician',
        status: 'active',
        appointments: 28,
        joinedAt: 'Dec 15, 2024'
    },
    {
        id: '2',
        name: 'Dr. Michael Chen',
        email: 'michael@smartclinic.com',
        specialty: 'Pediatric Cardiologist',
        status: 'active',
        appointments: 42,
        joinedAt: 'Dec 14, 2024'
    },
    {
        id: '3',
        name: 'Dr. Maria Rodriguez',
        email: 'maria@smartclinic.com',
        specialty: 'Neonatologist',
        status: 'pending',
        appointments: 0,
        joinedAt: 'Dec 13, 2024'
    },
    {
        id: '4',
        name: 'Dr. James Wilson',
        email: 'james@smartclinic.com',
        specialty: 'Pediatric Surgeon',
        status: 'active',
        appointments: 15,
        joinedAt: 'Dec 12, 2024'
    },
    {
        id: '5',
        name: 'Dr. Lisa Kim',
        email: 'lisa@smartclinic.com',
        specialty: 'Pediatrician',
        status: 'active',
        appointments: 35,
        joinedAt: 'Dec 10, 2024'
    }
];

const adminActivity: ActivityItem[] = [
    {
        id: '1',
        type: 'patient',
        title: 'New Family Registered',
        description: 'The Johnson family registered with 2 children',
        timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        user: {
            id: 'admin1',
            name: 'System Admin',
            role: 'Administrator'
        },
        patient: {
            id: 'fam1',
            name: 'Johnson Family',
            age: '2 children'
        },
        action: 'Registration',
        priority: 'low',
        link: '/admin/patients/new'
    },
    {
        id: '2',
        type: 'medical',
        title: 'System Alert: High Wait Time',
        description: 'Average wait time exceeded 45 minutes',
        timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
        user: {
            id: 'system',
            name: 'Monitoring System',
            role: 'System'
        },
        action: 'Alert',
        priority: 'high',
        link: '/admin/alerts'
    },
    {
        id: '3',
        type: 'appointment',
        title: 'Clinic Peak Hours',
        description: 'Appointment bookings at 95% capacity',
        timestamp: new Date(Date.now() - 6 * 3600000), // 6 hours ago
        user: {
            id: 'system',
            name: 'Analytics System',
            role: 'System'
        },
        action: 'Report',
        priority: 'medium',
        link: '/admin/analytics'
    },
    {
        id: '4',
        type: 'immunization',
        title: 'Vaccine Inventory Low',
        description: 'MMR vaccine stock below minimum threshold',
        timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
        user: {
            id: 'inv1',
            name: 'Inventory System',
            role: 'System'
        },
        action: 'Restock Needed',
        priority: 'high',
        link: '/admin/inventory'
    },
    {
        id: '5',
        type: 'prescription',
        title: 'Provider Registration Pending',
        description: 'Dr. Maria Rodriguez awaiting approval',
        timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
        user: {
            id: 'admin2',
            name: 'HR Admin',
            role: 'Administrator'
        },
        patient: {
            id: 'prov3',
            name: 'Dr. Maria Rodriguez'
        },
        action: 'Approve Provider',
        priority: 'medium',
        link: '/admin/providers/pending'
    }
];

const providerColumns = [
    {
        key: 'provider',
        header: 'Provider',
        render: (item: (typeof recentProviders)[0]) => (
            <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500/20 to-cyan-500/20'>
                    <Stethoscope className='h-5 w-5 text-blue-600' />
                </div>
                <div>
                    <p className='font-medium'>{item.name}</p>
                    <p className='text-muted-foreground text-xs'>{item.email}</p>
                </div>
            </div>
        )
    },
    {
        key: 'specialty',
        header: 'Specialty',
        render: (item: (typeof recentProviders)[0]) => (
            <span className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-400'>
                <HeartPulse className='h-3 w-3' />
                {item.specialty}
            </span>
        )
    },
    {
        key: 'status',
        header: 'Status',
        render: (item: (typeof recentProviders)[0]) => {
            const statusConfig = {
                active: {
                    icon: CheckCircle,
                    color: 'text-emerald-600 dark:text-emerald-400',
                    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
                    label: 'Active'
                },
                pending: {
                    icon: Clock,
                    color: 'text-amber-600 dark:text-amber-400',
                    bg: 'bg-amber-100 dark:bg-amber-900/30',
                    label: 'Pending'
                },
                onLeave: {
                    icon: AlertTriangle,
                    color: 'text-red-600 dark:text-red-400',
                    bg: 'bg-red-100 dark:bg-red-900/30',
                    label: 'On Leave'
                }
            };
            const config = statusConfig[item.status as keyof typeof statusConfig];
            const Icon = config.icon;

            return (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-medium text-xs ${config.bg} ${config.color}`}
                >
                    <Icon className='h-3 w-3' />
                    {config.label}
                </span>
            );
        }
    },
    {
        key: 'appointments',
        header: 'Appointments',
        render: (item: (typeof recentProviders)[0]) => (
            <div className='text-center'>
                <span className='font-bold text-lg'>{item.appointments}</span>
                <div className='text-muted-foreground text-xs'>This week</div>
            </div>
        )
    }
];

export function AdminOverview() {
    const { user } = useAuth();

    // Mock data for clinic admin stats
    const clinicStats = {
        totalPatients: 1248,
        activeProviders: 12,
        appointmentsToday: 156,
        monthlyRevenue: 45280,
        patientSatisfaction: 94,
        pendingTasks: 8
    };

    return (
        <div className='space-y-6'>
            {/* Welcome Section */}
            <div className='rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 via-cyan-50 to-emerald-50 p-6 dark:border-blue-900/50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-emerald-900/20'>
                <div className='flex items-center justify-between'>
                    <div>
                        <div className='mb-2 flex items-center gap-2'>
                            <Building className='h-6 w-6 text-blue-600' />
                            <h2 className='font-bold text-2xl text-gray-900 tracking-tight dark:text-white'>
                                Clinic Administration
                            </h2>
                        </div>
                        <p className='mt-1 text-gray-600 dark:text-gray-300'>
                            Welcome back,{' '}
                            <span className='font-semibold text-blue-700 dark:text-blue-300'>
                                {user?.name || 'Administrator'}
                            </span>
                            . Monitor clinic operations and manage resources.
                        </p>
                    </div>
                    <div className='hidden items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1.5 font-medium text-emerald-700 text-sm sm:flex dark:bg-emerald-900/30 dark:text-emerald-400'>
                        <CheckCircle className='h-4 w-4' />
                        Clinic Operations Normal
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <StatsGrid columns={5}>
                <StatsCard
                    description='Registered patients'
                    icon={Users}
                    title='Total Patients'
                    trend={{ value: 12, label: 'vs last month' }}
                    value={clinicStats.totalPatients.toString()}
                />
                <StatsCard
                    description='Active medical staff'
                    icon={Users2}
                    title='Providers'
                    trend={{ value: 2, label: 'new this month' }}
                    value={clinicStats.activeProviders.toString()}
                />
                <StatsCard
                    description='Scheduled for today'
                    icon={Calendar}
                    title="Today\'s Appointments"
                    trend={{ value: 8, label: 'vs yesterday' }}
                    value={clinicStats.appointmentsToday.toString()}
                />
                <StatsCard
                    description='This month'
                    icon={DollarSign}
                    title='Monthly Revenue'
                    trend={{ value: 15, label: 'increase' }}
                    value={`$${clinicStats.monthlyRevenue.toLocaleString()}`}
                />
                <StatsCard
                    description='Patient satisfaction'
                    icon={HeartPulse}
                    title='Satisfaction Rate'
                    trend={{ value: 3, label: 'improvement' }}
                    value={`${clinicStats.patientSatisfaction}%`}
                />
                <StatsCard
                    description='Tasks requiring action'
                    icon={Bell}
                    title='Pending Tasks'
                    trend={{ value: -2, label: 'since yesterday' }}
                    value={clinicStats.pendingTasks.toString()}
                />
            </StatsGrid>

            {/* Main Content Grid */}
            <div className='grid gap-6 lg:grid-cols-3'>
                {/* Active Providers */}
                <div className='lg:col-span-2'>
                    <Card className='h-full'>
                        <CardHeader
                            action={
                                <Button
                                    asChild
                                    size='sm'
                                    variant='outline'
                                >
                                    <Link
                                        className='flex items-center gap-1'
                                        href='/admin/providers'
                                    >
                                        <Users className='mr-2 h-4 w-4' />
                                        Manage Providers
                                    </Link>
                                </Button>
                            }
                        >
                            <CardTitle>Active Medical Providers</CardTitle>
                            <CardDescription>Current clinic medical staff and performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={providerColumns}
                                data={recentProviders}
                                emptyMessage='No providers found'
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Clinic Activity */}
                <Card>
                    <CardHeader
                        action={
                            <Button
                                asChild
                                size='sm'
                                variant='ghost'
                            >
                                <Link
                                    className='flex items-center gap-1'
                                    href='/admin/analytics'
                                >
                                    View all
                                    <ChevronRight className='h-4 w-4' />
                                </Link>
                            </Button>
                        }
                    >
                        <CardTitle>Clinic Activity</CardTitle>
                        <CardDescription>Recent system and administrative events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ActivityFeed
                            compact={true}
                            items={adminActivity}
                            maxItems={5}
                            showPatientInfo={true}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* System Health & Quick Actions */}
            <div className='grid gap-6 lg:grid-cols-2'>
                {/* Clinic Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Clinic Performance</CardTitle>
                        <CardDescription>Key operational metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <ClinicMetric
                                description='Clinic average'
                                label='Average Wait Time'
                                status={clinicStats.appointmentsToday > 150 ? 'warning' : 'healthy'}
                                value='18 min'
                            />
                            <ClinicMetric
                                description='Below industry average'
                                label='Appointment No-Show Rate'
                                status={clinicStats.patientSatisfaction < 90 ? 'warning' : 'healthy'}
                                value='4.2%'
                            />
                            <ClinicMetric
                                description='Optimal range'
                                label='Provider Utilization'
                                status='healthy'
                                value='82%'
                            />
                            <ClinicMetric
                                description='Growing steadily'
                                label='Telehealth Adoption'
                                status={clinicStats.monthlyRevenue > 40000 ? 'healthy' : 'warning'}
                                value='28%'
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Administrative Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Administrative Actions</CardTitle>
                        <CardDescription>Common clinic management tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-2 gap-3'>
                            <AdminAction
                                description='Financial reports'
                                href='/admin/billing'
                                icon={DollarSign}
                                label='Billing Reports'
                                variant='emerald'
                            />
                            <AdminAction
                                description='Clinic scheduling'
                                href='/admin/schedule'
                                icon={Calendar}
                                label='Schedule Management'
                                variant='blue'
                            />
                            <AdminAction
                                description='Medical supplies'
                                href='/admin/inventory'
                                icon={Pill}
                                label='Inventory Control'
                                variant='amber'
                            />
                            <AdminAction
                                description='Performance metrics'
                                href='/admin/reports'
                                icon={BarChart3}
                                label='Analytics'
                                variant='purple'
                            />
                            <AdminAction
                                description='Clinic configuration'
                                href='/admin/settings'
                                icon={Settings}
                                label='System Settings'
                                variant='gray'
                            />
                            <AdminAction
                                description='HR functions'
                                href='/admin/staff'
                                icon={Users}
                                label='Staff Management'
                                variant='cyan'
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ClinicMetric({
    label,
    value,
    status,
    description
}: {
    label: string;
    value: string;
    status: 'healthy' | 'warning' | 'critical';
    description: string;
}) {
    const statusConfig = {
        healthy: {
            dot: 'bg-emerald-500',
            text: 'text-emerald-700 dark:text-emerald-400',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20'
        },
        warning: {
            dot: 'bg-amber-500',
            text: 'text-amber-700 dark:text-amber-400',
            bg: 'bg-amber-50 dark:bg-amber-900/20'
        },
        critical: {
            dot: 'bg-red-500',
            text: 'text-red-700 dark:text-red-400',
            bg: 'bg-red-50 dark:bg-red-900/20'
        }
    };

    const config = statusConfig[status];

    return (
        <div className={`rounded-lg border p-4 ${config.bg}`}>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className={`h-2 w-2 rounded-full ${config.dot}`} />
                    <span className={`font-medium text-sm ${config.text}`}>{label}</span>
                </div>
                <span className='font-bold text-lg'>{value}</span>
            </div>
            <p className='mt-2 text-gray-600 text-xs'>{description}</p>
        </div>
    );
}

function AdminAction({
    href,
    icon: Icon,
    label,
    variant,
    description
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    variant: 'blue' | 'emerald' | 'amber' | 'purple' | 'cyan' | 'gray' | 'red';
    description: string;
}) {
    const variantClasses = {
        blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-900/20',
        emerald:
            'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-900/20',
        amber: 'border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-900/20',
        purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-900/20',
        cyan: 'border-cyan-200 bg-cyan-50 hover:bg-cyan-100 dark:border-cyan-900/50 dark:bg-cyan-900/20',
        gray: 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800/50',
        red: 'border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20'
    };

    const iconColors = {
        blue: 'text-blue-600 dark:text-blue-400',
        emerald: 'text-emerald-600 dark:text-emerald-400',
        amber: 'text-amber-600 dark:text-amber-400',
        purple: 'text-purple-600 dark:text-purple-400',
        cyan: 'text-cyan-600 dark:text-cyan-400',
        gray: 'text-gray-600 dark:text-gray-400',
        red: 'text-red-600 dark:text-red-400'
    };

    return (
        <Link
            className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-all hover:shadow-sm ${variantClasses[variant]}`}
            href={href as Route}
        >
            <Icon className={`mb-2 h-8 w-8 ${iconColors[variant]}`} />
            <span className='mb-1 text-center font-semibold text-sm'>{label}</span>
            <span className='text-center text-gray-600 text-xs'>{description}</span>
        </Link>
    );
}
