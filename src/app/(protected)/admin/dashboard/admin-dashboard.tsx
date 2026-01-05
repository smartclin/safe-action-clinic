// src/components/admin/dashboard/admin-dashboard.tsx
'use client';

import { Activity, Baby, Calendar, DollarSign, HeartPulse, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ActivityFeed, CardContent } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClinicStats {
    totalPatients: number;
    activeProviders: number;
    appointmentsToday: number;
    monthlyRevenue: number;
    patientSatisfaction: number;
    pendingTasks: number;
}

export function AdminDashboard() {
    const [stats, setStats] = useState<ClinicStats>({
        totalPatients: 0,
        activeProviders: 0,
        appointmentsToday: 0,
        monthlyRevenue: 0,
        patientSatisfaction: 0,
        pendingTasks: 0
    });
    const [, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch stats from API
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                // Mock data - replace with actual API call
                const mockStats = {
                    totalPatients: 1248,
                    activeProviders: 12,
                    appointmentsToday: 156,
                    monthlyRevenue: 45280,
                    patientSatisfaction: 94,
                    pendingTasks: 8
                };
                setStats(mockStats);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({
        title,
        value,
        icon: Icon,
        trend,
        description
    }: {
        title: string;
        value: string | number;
        icon: React.ComponentType<{ className?: string }>;
        trend?: { value: number; label: string };
        description: string;
    }) => (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='font-medium text-sm'>{title}</CardTitle>
                <Icon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
                <div className='font-bold text-2xl'>{value}</div>
                {trend && (
                    <p className='text-muted-foreground text-xs'>
                        <span className={trend.value > 0 ? 'text-green-600' : 'text-red-600'}>
                            {trend.value > 0 ? '+' : ''}
                            {trend.value}%
                        </span>{' '}
                        {trend.label}
                    </p>
                )}
                <p className='mt-1 text-muted-foreground text-xs'>{description}</p>
            </CardContent>
        </Card>
    );

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-3xl tracking-tight'>Clinic Dashboard</h1>
                    <p className='text-muted-foreground'>Overview of clinic operations and performance</p>
                </div>
                <div className='flex gap-2'>
                    <Button variant='outline'>Export Report</Button>
                    <Button>Refresh Data</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <StatCard
                    description='Registered patients in the system'
                    icon={Users}
                    title='Total Patients'
                    trend={{ value: 12, label: 'from last month' }}
                    value={stats.totalPatients.toLocaleString()}
                />
                <StatCard
                    description='Medical staff currently active'
                    icon={HeartPulse}
                    title='Active Providers'
                    trend={{ value: 2, label: 'new this month' }}
                    value={stats.activeProviders}
                />
                <StatCard
                    description='Scheduled appointments today'
                    icon={Calendar}
                    title="Today's Appointments"
                    trend={{ value: 8, label: 'vs yesterday' }}
                    value={stats.appointmentsToday}
                />
                <StatCard
                    description='Revenue generated this month'
                    icon={DollarSign}
                    title='Monthly Revenue'
                    trend={{ value: 15, label: 'growth' }}
                    value={`$${stats.monthlyRevenue.toLocaleString()}`}
                />
                <StatCard
                    description='Patient satisfaction rate'
                    icon={Baby}
                    title='Patient Satisfaction'
                    trend={{ value: 3, label: 'improvement' }}
                    value={`${stats.patientSatisfaction}%`}
                />
                <StatCard
                    description='Tasks requiring attention'
                    icon={Activity}
                    title='Pending Tasks'
                    trend={{ value: -2, label: 'since yesterday' }}
                    value={stats.pendingTasks}
                />
            </div>

            {/* Tabs for different views */}
            <Tabs
                className='space-y-4'
                defaultValue='overview'
            >
                <TabsList>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='analytics'>Analytics</TabsTrigger>
                    <TabsTrigger value='activity'>Recent Activity</TabsTrigger>
                    <TabsTrigger value='alerts'>Alerts</TabsTrigger>
                </TabsList>

                <TabsContent
                    className='space-y-4'
                    value='overview'
                >
                    <div className='grid gap-4 md:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Appointment Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Add appointment status chart here */}
                                <div className='flex h-[200px] items-center justify-center text-muted-foreground'>
                                    Appointment Status Chart
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Provider Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Add provider performance chart here */}
                                <div className='flex h-[200px] items-center justify-center text-muted-foreground'>
                                    Provider Performance Chart
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value='activity'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Clinic Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ActivityFeed
                                emptyMessage='No recent activity' // Pass actual activity items
                                items={[]}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                        <Button
                            className='flex h-auto flex-col gap-2 py-4'
                            variant='outline'
                        >
                            <Calendar className='h-6 w-6' />
                            <span>Schedule</span>
                        </Button>
                        <Button
                            className='flex h-auto flex-col gap-2 py-4'
                            variant='outline'
                        >
                            <Users className='h-6 w-6' />
                            <span>Patients</span>
                        </Button>
                        <Button
                            className='flex h-auto flex-col gap-2 py-4'
                            variant='outline'
                        >
                            <DollarSign className='h-6 w-6' />
                            <span>Billing</span>
                        </Button>
                        <Button
                            className='flex h-auto flex-col gap-2 py-4'
                            variant='outline'
                        >
                            <TrendingUp className='h-6 w-6' />
                            <span>Reports</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
