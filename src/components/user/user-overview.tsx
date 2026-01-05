'use client';

import {
    Baby,
    Bell,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    ExternalLink,
    FileText,
    HeartPulse,
    Home,
    Phone,
    Pill,
    Shield,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import {
    ActivityFeed,
    type ActivityItem,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    StatsCard,
    StatsGrid
} from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks';

// Mock data for patient dashboard
const upcomingAppointments = [
    {
        id: '1',
        date: '2024-12-20',
        time: '10:00 AM',
        doctor: 'Dr. Sarah Johnson',
        type: 'Well-child Check',
        location: 'Main Clinic',
        status: 'confirmed'
    },
    {
        id: '2',
        date: '2024-12-27',
        time: '02:30 PM',
        doctor: 'Dr. Michael Chen',
        type: 'Vaccination',
        location: 'Pediatrics Wing',
        status: 'scheduled'
    },
    {
        id: '3',
        date: '2025-01-05',
        time: '11:15 AM',
        doctor: 'Dr. Lisa Kim',
        type: 'Follow-up',
        location: 'Telehealth',
        status: 'pending'
    }
];

const recentActivity: ActivityItem[] = [
    {
        id: '1',
        type: 'appointment',
        title: 'Appointment Completed',
        description: 'Well-child check completed successfully',
        timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
        user: {
            id: 'doc1',
            name: 'Dr. Sarah Johnson',
            role: 'Pediatrician'
        },
        action: 'Completed',
        priority: 'low',
        link: '/appointments/1'
    },
    {
        id: '2',
        type: 'prescription',
        title: 'Prescription Issued',
        description: 'Amoxicillin for ear infection',
        timestamp: new Date(Date.now() - 5 * 24 * 3600000), // 5 days ago
        user: {
            id: 'doc2',
            name: 'Dr. Michael Chen',
            role: 'Pediatric Cardiologist'
        },
        action: 'prescription',
        priority: 'medium',
        link: '/medications'
    },
    {
        id: '3',
        type: 'immunization',
        title: 'Vaccination Administered',
        description: 'MMR vaccine given as scheduled',
        timestamp: new Date(Date.now() - 14 * 24 * 3600000), // 14 days ago
        user: {
            id: 'nurse1',
            name: 'Nurse Emily Davis',
            role: 'RN'
        },
        action: 'Immunization',
        priority: 'low',
        link: '/immunizations'
    },
    {
        id: '4',
        type: 'growth',
        title: 'Growth Chart Updated',
        description: 'Height and weight measurements recorded',
        timestamp: new Date(Date.now() - 30 * 24 * 3600000), // 30 days ago
        user: {
            id: 'doc3',
            name: 'Dr. Maria Rodriguez',
            role: 'Neonatologist'
        },
        action: 'Updated',
        priority: 'low',
        link: '/growth-charts'
    }
];

const children = [
    {
        id: '1',
        name: 'Emma Johnson',
        age: '3 years',
        nextCheckup: '2024-12-20',
        immunizations: 'Up to date',
        weight: '15.2 kg',
        height: '95 cm'
    },
    {
        id: '2',
        name: 'Liam Johnson',
        age: '2 months',
        nextCheckup: '2024-12-27',
        immunizations: 'Due: DTaP',
        weight: '5.8 kg',
        height: '58 cm'
    }
];

export function PatientOverview() {
    const { user } = useAuth();
    const [patientData, setPatientData] = useState({
        name: '',
        primaryCarePhysician: '',
        lastCheckup: '',
        nextAppointment: '',
        childrenCount: 0,
        activePrescriptions: 0
    });

    useEffect(() => {
        // Fetch patient data from API
        const fetchPatientData = async () => {
            try {
                // Mock data - replace with actual API call
                const mockData = {
                    name: user?.name || 'Parent User',
                    primaryCarePhysician: 'Dr. Sarah Johnson',
                    lastCheckup: '2024-11-15',
                    nextAppointment: '2024-12-20',
                    childrenCount: 2,
                    activePrescriptions: 1
                };
                setPatientData(mockData);
            } catch (error) {
                console.error('Failed to fetch patient data:', error);
            }
        };

        fetchPatientData();
    }, [user]);

    const patientStats = {
        totalAppointments: 24,
        completedAppointments: 22,
        upcomingAppointments: 2,
        satisfactionScore: 96
    };

    return (
        <div className='space-y-6'>
            {/* Welcome Section */}
            <div className='rounded-xl border border-blue-200 bg-linear-to-r from-blue-50 via-cyan-50 to-emerald-50 p-6 dark:border-blue-900/50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-emerald-900/20'>
                <div className='flex items-center justify-between'>
                    <div>
                        <div className='mb-2 flex items-center gap-2'>
                            <Home className='h-6 w-6 text-blue-600' />
                            <h2 className='font-bold text-2xl text-gray-900 tracking-tight dark:text-white'>
                                Family Health Portal
                            </h2>
                        </div>
                        <p className='mt-1 text-gray-600 dark:text-gray-300'>
                            Welcome back,{' '}
                            <span className='font-semibold text-blue-700 dark:text-blue-300'>{patientData.name}</span>!
                            Manage your family's health and appointments.
                        </p>
                    </div>
                    <div className='hidden items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1.5 font-medium text-emerald-700 text-sm sm:flex dark:bg-emerald-900/30 dark:text-emerald-400'>
                        <CheckCircle className='h-4 w-4' />
                        All Upcoming Appointments Confirmed
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <StatsGrid columns={4}>
                <StatsCard
                    description='Total appointments'
                    icon={Calendar}
                    title='Appointments'
                    trend={{ value: 2, label: 'this month' }}
                    value={patientStats.totalAppointments.toString()}
                />
                <StatsCard
                    description='Upcoming appointments'
                    icon={Clock}
                    title='Upcoming'
                    value={patientStats.upcomingAppointments.toString()}
                />
                <StatsCard
                    description='Family satisfaction'
                    icon={HeartPulse}
                    title='Satisfaction Score'
                    trend={{ value: 3, label: 'improvement' }}
                    value={`${patientStats.satisfactionScore}%`}
                />
                <StatsCard
                    description='Active medications'
                    icon={Pill}
                    title='Prescriptions'
                    value={patientData.activePrescriptions.toString()}
                />
            </StatsGrid>

            {/* Main Content Grid */}
            <div className='grid gap-6 lg:grid-cols-3'>
                {/* Your Children */}
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
                                        href='/patients/children'
                                    >
                                        <Users className='mr-2 h-4 w-4' />
                                        Manage Children
                                    </Link>
                                </Button>
                            }
                        >
                            <CardTitle>Your Children</CardTitle>
                            <CardDescription>Manage health records for your children</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                {children.map(child => (
                                    <div
                                        className='flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50'
                                        key={child.id}
                                    >
                                        <div className='flex items-center gap-4'>
                                            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-blue-500/20 to-cyan-500/20'>
                                                <Baby className='h-6 w-6 text-blue-600' />
                                            </div>
                                            <div>
                                                <h4 className='font-semibold'>{child.name}</h4>
                                                <p className='text-muted-foreground text-sm'>
                                                    {child.age} • {child.weight} • {child.height}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <p className='font-medium text-sm'>Next Checkup</p>
                                            <p className='text-muted-foreground text-sm'>
                                                {new Date(child.nextCheckup).toLocaleDateString()}
                                            </p>
                                            <div className='mt-2'>
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium text-xs ${
                                                        child.immunizations === 'Up to date'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                                    }`}
                                                >
                                                    {child.immunizations}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Appointments */}
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
                                    href='/appointments'
                                >
                                    View all
                                    <ChevronRight className='h-4 w-4' />
                                </Link>
                            </Button>
                        }
                    >
                        <CardTitle>Upcoming Appointments</CardTitle>
                        <CardDescription>Your scheduled visits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-3'>
                            {upcomingAppointments.map(appointment => (
                                <div
                                    className='rounded-lg border border-border p-4 hover:bg-accent/50'
                                    key={appointment.id}
                                >
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <h4 className='font-medium'>{appointment.type}</h4>
                                            <p className='text-muted-foreground text-sm'>{appointment.doctor}</p>
                                        </div>
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 font-medium text-xs ${
                                                appointment.status === 'confirmed'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : appointment.status === 'scheduled'
                                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </div>
                                    <div className='mt-2 flex items-center justify-between text-sm'>
                                        <div className='flex items-center gap-2'>
                                            <Calendar className='h-3 w-3 text-muted-foreground' />
                                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                        </div>
                                        <div className='text-muted-foreground'>{appointment.location}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className='grid gap-6 lg:grid-cols-2'>
                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your family's latest health updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ActivityFeed
                            compact={true}
                            items={recentActivity}
                            maxItems={5}
                            showPatientInfo={false}
                        />
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and features</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-2 gap-3'>
                            <QuickAction
                                description='Schedule new visit'
                                href='/appointments/new'
                                icon={Calendar}
                                label='Book Appointment'
                                variant='blue'
                            />
                            <QuickAction
                                description='Prescription refills'
                                href='/medications'
                                icon={Pill}
                                label='View Medications'
                                variant='purple'
                            />
                            <QuickAction
                                description='Health history'
                                href='/medical-records'
                                icon={FileText}
                                label='Medical Records'
                                variant='emerald'
                            />
                            <QuickAction
                                description='Vaccine schedule'
                                href='/immunizations'
                                icon={Shield}
                                label='Immunizations'
                                variant='amber'
                            />
                            <QuickAction
                                description='Contact doctors'
                                href='/messages'
                                icon={Bell}
                                label='Messages'
                                variant='cyan'
                            />
                            <QuickAction
                                description='Payments & claims'
                                href='/billing'
                                icon={TrendingUp}
                                label='Billing & Insurance'
                                variant='gray'
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Health Resources */}
            <Card>
                <CardHeader>
                    <CardTitle>Health Resources</CardTitle>
                    <CardDescription>Helpful information for pediatric care</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        <ResourceLink
                            description='Pediatric health tips and advice'
                            href='https://www.healthychildren.org'
                            icon='👶'
                            title='Healthy Children'
                        />
                        <ResourceLink
                            description='CDC vaccination schedules'
                            href='https://www.cdc.gov/vaccines/schedules'
                            icon='💉'
                            title='Vaccine Schedule'
                        />
                        <ResourceLink
                            description='Child development milestones'
                            href='https://www.cdc.gov/ncbddd/actearly/milestones'
                            icon='📊'
                            title='Growth Milestones'
                        />
                        <ResourceLink
                            description='Emergency care information'
                            href='/resources/emergency'
                            icon='🚨'
                            title='Emergency Contacts'
                        />
                        <ResourceLink
                            description='24/7 pediatric advice'
                            href='tel:+18005551234'
                            icon={Phone}
                            title='On-Call Doctor'
                        />
                        <ResourceLink
                            description='Download health forms'
                            href='/resources/forms'
                            icon={FileText}
                            title='Medical Forms'
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function QuickAction({
    href,
    icon: Icon,
    label,
    variant,
    description
}: {
    href: string;
    icon: React.ComponentType<{ className?: string }> | string;
    label: string;
    variant: 'blue' | 'purple' | 'emerald' | 'amber' | 'cyan' | 'gray' | 'red';
    description: string;
}) {
    const variantClasses = {
        blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-900/20',
        purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-900/20',
        emerald:
            'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-900/20',
        amber: 'border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-900/20',
        cyan: 'border-cyan-200 bg-cyan-50 hover:bg-cyan-100 dark:border-cyan-900/50 dark:bg-cyan-900/20',
        gray: 'border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800/50',
        red: 'border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20'
    };

    const iconColors = {
        blue: 'text-blue-600 dark:text-blue-400',
        purple: 'text-purple-600 dark:text-purple-400',
        emerald: 'text-emerald-600 dark:text-emerald-400',
        amber: 'text-amber-600 dark:text-amber-400',
        cyan: 'text-cyan-600 dark:text-cyan-400',
        gray: 'text-gray-600 dark:text-gray-400',
        red: 'text-red-600 dark:text-red-400'
    };

    return (
        <Link
            className={`flex flex-col items-center justify-center rounded-lg border p-4 transition-all hover:shadow-sm ${variantClasses[variant]}`}
            href={href}
        >
            {typeof Icon === 'string' ? (
                <span className='mb-2 text-2xl'>{Icon}</span>
            ) : (
                <Icon className={`mb-2 h-8 w-8 ${iconColors[variant]}`} />
            )}
            <span className='mb-1 text-center font-semibold text-sm'>{label}</span>
            <span className='text-center text-gray-600 text-xs'>{description}</span>
        </Link>
    );
}

function ResourceLink({
    title,
    description,
    href,
    icon: Icon
}: {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }> | string;
}) {
    const isExternal = href.startsWith('http') || href.startsWith('tel');

    return (
        <a
            className='flex items-start gap-3 rounded-lg border border-border p-4 transition-all hover:border-primary/20 hover:bg-primary/5'
            href={href}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            target={isExternal ? '_blank' : undefined}
        >
            {typeof Icon === 'string' ? (
                <span className='mt-0.5 text-2xl'>{Icon}</span>
            ) : (
                <Icon className='mt-0.5 h-5 w-5 shrink-0 text-primary' />
            )}
            <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-1'>
                    <p className='font-medium'>{title}</p>
                    {isExternal && <ExternalLink className='h-3 w-3 text-muted-foreground' />}
                </div>
                <p className='text-muted-foreground text-sm'>{description}</p>
            </div>
        </a>
    );
}
