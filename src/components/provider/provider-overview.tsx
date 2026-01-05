'use client';

import {
    AlertCircle,
    Baby,
    Calendar,
    Clock,
    FileText,
    HeartPulse,
    Pill,
    Plus,
    Stethoscope,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';

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
import { useAuth } from '@/hooks/use-auth';

// Mock data for pediatric clinic
const upcomingAppointments = [
    {
        id: '1',
        patientName: 'Emma Johnson',
        patientAge: '3 years',
        time: '09:00 AM',
        doctor: 'Dr. Smith',
        type: 'Vaccination',
        status: 'confirmed'
    },
    {
        id: '2',
        patientName: 'Liam Chen',
        patientAge: '2 months',
        time: '10:15 AM',
        doctor: 'Dr. Rodriguez',
        type: 'Well-child Check',
        status: 'pending'
    },
    {
        id: '3',
        patientName: 'Sophia Williams',
        patientAge: '5 years',
        time: '11:30 AM',
        doctor: 'Dr. Patel',
        type: 'Follow-up',
        status: 'confirmed'
    },
    {
        id: '4',
        patientName: 'Noah Davis',
        patientAge: '1 year',
        time: '02:00 PM',
        doctor: 'Dr. Kim',
        type: 'Growth Assessment',
        status: 'cancelled'
    },
    {
        id: '5',
        patientName: 'Olivia Martinez',
        patientAge: '4 years',
        time: '03:45 PM',
        doctor: 'Dr. Smith',
        type: 'Sick Visit',
        status: 'confirmed'
    }
];

const recentActivity: ActivityItem[] = [
    {
        id: '1',
        type: 'appointment',
        title: 'Well-child Check Completed',
        description: 'Growth milestones met, vaccinations up to date',
        timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        user: {
            id: 'doc1',
            name: 'Dr. Sarah Johnson',
            role: 'Pediatrician'
        },
        patient: {
            id: 'pat1',
            name: 'Emma Johnson',
            age: '3 years'
        },
        action: 'Completed',
        priority: 'low',
        link: '/appointments/1'
    },
    {
        id: '2',
        type: 'prescription',
        title: 'Prescription Issued',
        description: 'Amoxicillin for ear infection, 10-day course',
        timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
        user: {
            id: 'doc2',
            name: 'Dr. Michael Chen',
            role: 'Pediatrician'
        },
        patient: {
            id: 'pat2',
            name: 'Liam Chen',
            age: '2 months'
        },
        action: 'E-prescription',
        priority: 'medium',
        link: '/patients/2/medications'
    },
    {
        id: '3',
        type: 'immunization',
        title: 'Vaccination Administered',
        description: 'MMR vaccine administered as per schedule',
        timestamp: new Date(Date.now() - 6 * 3600000), // 6 hours ago
        user: {
            id: 'nurse1',
            name: 'Nurse Emily Davis',
            role: 'RN'
        },
        patient: {
            id: 'pat3',
            name: 'Sophia Williams',
            age: '5 years'
        },
        action: 'Immunization',
        priority: 'low',
        link: '/patients/3/immunizations'
    },
    {
        id: '4',
        type: 'growth',
        title: 'Growth Chart Updated',
        description: 'Weight and height percentile improved',
        timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
        user: {
            id: 'doc3',
            name: 'Dr. Maria Rodriguez',
            role: 'Pediatrician'
        },
        patient: {
            id: 'pat4',
            name: 'Noah Davis',
            age: '1 year'
        },
        action: 'Updated',
        priority: 'low',
        link: '/patients/4/growth'
    },
    {
        id: '5',
        type: 'patient',
        title: 'New Patient Registered',
        description: 'Family of 3 registered with the clinic',
        timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
        user: {
            id: 'staff1',
            name: 'Reception Staff',
            role: 'Reception'
        },
        patient: {
            id: 'pat5',
            name: 'Olivia Martinez',
            age: '4 years'
        },
        action: 'Registration',
        priority: 'low',
        link: '/patients/5'
    }
];

const appointmentsColumns = [
    {
        key: 'patient',
        header: 'Patient',
        render: (item: (typeof upcomingAppointments)[0]) => (
            <div>
                <p className='font-medium'>{item.patientName}</p>
                <p className='flex items-center gap-1 text-muted-foreground text-xs'>
                    <Baby className='h-3 w-3' />
                    {item.patientAge}
                </p>
            </div>
        )
    },
    {
        key: 'time',
        header: 'Time',
        render: (item: (typeof upcomingAppointments)[0]) => (
            <div className='flex items-center gap-1'>
                <Clock className='h-3 w-3 text-muted-foreground' />
                <span className='font-medium'>{item.time}</span>
            </div>
        )
    },
    {
        key: 'doctor',
        header: 'Provider',
        render: (item: (typeof upcomingAppointments)[0]) => (
            <div className='text-sm'>
                <span className='text-muted-foreground'>with</span> <span className='font-medium'>{item.doctor}</span>
            </div>
        )
    },
    {
        key: 'type',
        header: 'Type',
        render: (item: (typeof upcomingAppointments)[0]) => (
            <span className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-400'>
                <Stethoscope className='h-3 w-3' />
                {item.type}
            </span>
        )
    },
    {
        key: 'status',
        header: 'Status',
        render: (item: (typeof upcomingAppointments)[0]) => {
            const statusConfig = {
                confirmed: {
                    color: 'text-emerald-600 dark:text-emerald-400',
                    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
                    label: 'Confirmed'
                },
                pending: {
                    color: 'text-amber-600 dark:text-amber-400',
                    bg: 'bg-amber-100 dark:bg-amber-900/30',
                    label: 'Pending'
                },
                cancelled: {
                    color: 'text-red-600 dark:text-red-400',
                    bg: 'bg-red-100 dark:bg-red-900/30',
                    label: 'Cancelled'
                }
            };
            const config = statusConfig[item.status as keyof typeof statusConfig];

            return (
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-medium text-xs ${config.bg} ${config.color}`}
                >
                    {config.label}
                </span>
            );
        }
    }
];

export function ProviderOverview() {
    const { user } = useAuth();

    // Mock data for provider-specific stats
    const providerStats = {
        appointmentsToday: 12,
        pendingPrescriptions: 3,
        patientsSeenWeek: 45,
        satisfactionRate: 96
    };

    return (
        <div className='space-y-6'>
            {/* Welcome Section */}
            <div className='rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 via-cyan-50 to-emerald-50 p-6 dark:border-blue-900/50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-emerald-900/20'>
                <h2 className='font-bold text-2xl text-gray-900 tracking-tight dark:text-white'>
                    Good morning, {user?.name?.split(' ')[0] || 'Doctor'}!
                </h2>
                <p className='mt-1 text-gray-600 dark:text-gray-300'>
                    You have{' '}
                    <span className='font-semibold text-blue-700 dark:text-blue-300'>
                        {providerStats.appointmentsToday} appointments
                    </span>{' '}
                    today and{' '}
                    <span className='font-semibold text-amber-700 dark:text-amber-300'>
                        {providerStats.pendingPrescriptions} pending prescriptions
                    </span>
                </p>
            </div>

            {/* Stats Grid */}
            <StatsGrid columns={4}>
                <StatsCard
                    description="Today\'s schedule"
                    icon={Calendar({ className: 'h-6 w-6' })}
                    title='Appointments'
                    trend={{ value: 2, label: 'more than yesterday' }}
                    value={providerStats.appointmentsToday.toString()}
                />
                <StatsCard
                    description='To be reviewed'
                    icon={FileText}
                    title='Pending Prescriptions'
                    trend={{ value: -1, label: 'since yesterday' }}
                    value={providerStats.pendingPrescriptions.toString()}
                />
                <StatsCard
                    description='This week'
                    icon={Users}
                    title='Patients Seen'
                    trend={{ value: 8, label: 'vs last week' }}
                    value={providerStats.patientsSeenWeek.toString()}
                />
                <StatsCard
                    description='Patient satisfaction'
                    icon={HeartPulse}
                    title='Satisfaction Rate'
                    trend={{ value: 2, label: 'improvement' }}
                    value={`${providerStats.satisfactionRate}%`}
                />
            </StatsGrid>

            {/* Main Content Grid */}
            <div className='grid gap-6 lg:grid-cols-3'>
                {/* Today's Appointments */}
                <div className='lg:col-span-2'>
                    <Card className='h-full'>
                        <CardHeader
                            action={
                                <div className='flex gap-2'>
                                    <Button
                                        size='sm'
                                        variant='outline'
                                    >
                                        <Calendar className='mr-2 h-4 w-4' />
                                        Calendar
                                    </Button>
                                    <Button
                                        asChild
                                        size='sm'
                                    >
                                        <Link
                                            className='flex items-center gap-1'
                                            href='/appointments/new'
                                        >
                                            <Plus className='mr-2 h-4 w-4' />
                                            New Appointment
                                        </Link>
                                    </Button>
                                </div>
                            }
                        >
                            <CardTitle>Today's Appointments</CardTitle>
                            <CardDescription>Upcoming consultations and visits</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={appointmentsColumns}
                                data={upcomingAppointments}
                                emptyMessage='No appointments scheduled for today'
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity */}
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
                                    href='/activity'
                                >
                                    View all
                                    <FaChevronRight className='h-4 w-4' />
                                </Link>
                            </Button>
                        }
                    >
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest clinical updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ActivityFeed
                            compact={true}
                            items={recentActivity}
                            maxItems={5}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Clinical Metrics & Quick Actions */}
            <div className='grid gap-6 lg:grid-cols-2'>
                {/* Clinical Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Clinical Performance</CardTitle>
                        <CardDescription>Your key performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <ClinicalMetric
                                description='Below clinic average'
                                label='Average Wait Time'
                                trend={-8}
                                value='12 min'
                            />
                            <ClinicalMetric
                                description='Above target'
                                label='Follow-up Rate'
                                trend={5}
                                value='87%'
                            />
                            <ClinicalMetric
                                description='Excellent'
                                label='Vaccination Coverage'
                                trend={3}
                                value='94%'
                            />
                            <ClinicalMetric
                                description='High satisfaction'
                                label='Patient Satisfaction'
                                trend={2}
                                value='96%'
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common clinical tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-2 gap-3'>
                            <QuickAction
                                href='/prescriptions/new'
                                icon={Pill}
                                label='Write Prescription'
                                variant='blue'
                            />
                            <QuickAction
                                href='/patients/new'
                                icon={Users}
                                label='Add New Patient'
                                variant='green'
                            />
                            <QuickAction
                                href='/immunizations/schedule'
                                icon={HeartPulse}
                                label='Schedule Vaccine'
                                variant='purple'
                            />
                            <QuickAction
                                href='/reports/generate'
                                icon={FileText}
                                label='Generate Report'
                                variant='amber'
                            />
                            <QuickAction
                                href='/messages'
                                icon={AlertCircle}
                                label='Urgent Messages'
                                variant='red'
                            />
                            <QuickAction
                                href='/templates'
                                icon={FileText}
                                label='Clinical Notes'
                                variant='cyan'
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ClinicalMetric({
    label,
    value,
    trend,
    description
}: {
    label: string;
    value: string;
    trend: number;
    description: string;
}) {
    return (
        <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>{label}</span>
                <div className='flex items-center gap-2'>
                    <span className='font-medium'>{value}</span>
                    <span
                        className={`flex items-center text-xs ${
                            trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                        }`}
                    >
                        <TrendingUp className={`h-3 w-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                        {Math.abs(trend)}%
                    </span>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <div className='h-2 flex-1 rounded-full bg-muted'>
                    <div
                        className='h-full rounded-full bg-primary transition-all'
                        style={{ width: trend >= 0 ? '85%' : '65%' }}
                    />
                </div>
                <span className='text-muted-foreground text-xs'>{description}</span>
            </div>
        </div>
    );
}

function QuickAction({
    href,
    icon: Icon,
    label,
    variant
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    variant: 'blue' | 'green' | 'purple' | 'amber' | 'red' | 'cyan';
}) {
    const variantClasses = {
        blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-900/20',
        green: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-900/20',
        purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-900/20',
        amber: 'border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-900/20',
        red: 'border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20',
        cyan: 'border-cyan-200 bg-cyan-50 hover:bg-cyan-100 dark:border-cyan-900/50 dark:bg-cyan-900/20'
    };

    const iconColors = {
        blue: 'text-blue-600 dark:text-blue-400',
        green: 'text-emerald-600 dark:text-emerald-400',
        purple: 'text-purple-600 dark:text-purple-400',
        amber: 'text-amber-600 dark:text-amber-400',
        red: 'text-red-600 dark:text-red-400',
        cyan: 'text-cyan-600 dark:text-cyan-400'
    };

    return (
        <Link
            className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-all hover:shadow-sm ${variantClasses[variant]}`}
            href={href}
        >
            <Icon className={`mb-2 h-6 w-6 ${iconColors[variant]}`} />
            <span className='text-center font-medium text-sm'>{label}</span>
        </Link>
    );
}
