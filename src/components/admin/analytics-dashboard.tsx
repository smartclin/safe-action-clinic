// src/components/admin/analytics/analytics-dashboard.tsx
'use client';

import { Calendar, DollarSign, Download, Filter, HeartPulse, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AnalyticsDashboard() {
    const [timeRange, setTimeRange] = useState('month');
    const [metricType, setMetricType] = useState('all');

    const metrics = [
        {
            title: 'Patient Growth',
            value: '12.5%',
            change: '+2.3%',
            isPositive: true,
            icon: Users,
            description: 'New patient registrations'
        },
        {
            title: 'Appointment Volume',
            value: '1,248',
            change: '+8.2%',
            isPositive: true,
            icon: Calendar,
            description: 'Total appointments scheduled'
        },
        {
            title: 'Revenue Growth',
            value: '15.2%',
            change: '+3.1%',
            isPositive: true,
            icon: DollarSign,
            description: 'Monthly revenue increase'
        },
        {
            title: 'Satisfaction Rate',
            value: '94.2%',
            change: '+1.5%',
            isPositive: true,
            icon: HeartPulse,
            description: 'Patient satisfaction score'
        }
    ];

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-3xl tracking-tight'>Analytics Dashboard</h1>
                    <p className='text-muted-foreground'>Comprehensive insights into clinic performance and metrics</p>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline'>
                        <Filter className='mr-2 h-4 w-4' />
                        Filters
                    </Button>
                    <Button>
                        <Download className='mr-2 h-4 w-4' />
                        Export Report
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className='flex items-center gap-4'>
                <Select
                    onValueChange={setTimeRange}
                    value={timeRange}
                >
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select time range' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='week'>Last 7 days</SelectItem>
                        <SelectItem value='month'>Last 30 days</SelectItem>
                        <SelectItem value='quarter'>Last quarter</SelectItem>
                        <SelectItem value='year'>Last year</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    onValueChange={setMetricType}
                    value={metricType}
                >
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Metric type' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All Metrics</SelectItem>
                        <SelectItem value='clinical'>Clinical</SelectItem>
                        <SelectItem value='financial'>Financial</SelectItem>
                        <SelectItem value='patient'>Patient Metrics</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Key Metrics */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                {metrics.map(metric => (
                    <Card key={metric.title}>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='font-medium text-sm'>{metric.title}</CardTitle>
                            <metric.icon className='h-4 w-4 text-muted-foreground' />
                        </CardHeader>
                        <CardContent>
                            <div className='font-bold text-2xl'>{metric.value}</div>
                            <div className='flex items-center text-xs'>
                                {metric.isPositive ? (
                                    <TrendingUp className='mr-1 h-3 w-3 text-green-500' />
                                ) : (
                                    <TrendingDown className='mr-1 h-3 w-3 text-red-500' />
                                )}
                                <span className={metric.isPositive ? 'text-green-500' : 'text-red-500'}>
                                    {metric.change}
                                </span>
                                <span className='ml-1 text-muted-foreground'>from previous period</span>
                            </div>
                            <p className='mt-1 text-muted-foreground text-xs'>{metric.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detailed Analytics */}
            <Tabs
                className='space-y-4'
                defaultValue='overview'
            >
                <TabsList>
                    <TabsTrigger value='overview'>Overview</TabsTrigger>
                    <TabsTrigger value='financial'>Financial</TabsTrigger>
                    <TabsTrigger value='clinical'>Clinical</TabsTrigger>
                    <TabsTrigger value='patient'>Patient Analytics</TabsTrigger>
                </TabsList>

                <TabsContent
                    className='space-y-4'
                    value='overview'
                >
                    <div className='grid gap-4 md:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Appointment Trends</CardTitle>
                                <CardDescription>Monthly appointment volume over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='flex h-[300px] items-center justify-center text-muted-foreground'>
                                    Appointment Trends Chart
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Revenue Trends</CardTitle>
                                <CardDescription>Monthly revenue generation</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='flex h-[300px] items-center justify-center text-muted-foreground'>
                                    Revenue Trends Chart
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Provider Performance</CardTitle>
                            <CardDescription>Key metrics by medical provider</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex h-[400px] items-center justify-center text-muted-foreground'>
                                Provider Performance Table
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='financial'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Analytics</CardTitle>
                            <CardDescription>Detailed financial metrics and trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>{/* Add financial charts and tables */}</div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Quick Insights */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Insights</CardTitle>
                    <CardDescription>Automated insights from your clinic data</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='space-y-3'>
                        <div className='rounded-lg bg-green-50 p-4 dark:bg-green-900/20'>
                            <div className='flex items-center gap-2'>
                                <TrendingUp className='h-4 w-4 text-green-600' />
                                <h4 className='font-semibold text-green-800 dark:text-green-400'>Positive Trend</h4>
                            </div>
                            <p className='mt-2 text-green-700 text-sm dark:text-green-300'>
                                Patient satisfaction has increased by 3.2% this month, reaching 94.2% - the highest in 6
                                months.
                            </p>
                        </div>
                        <div className='rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20'>
                            <div className='flex items-center gap-2'>
                                <TrendingDown className='h-4 w-4 text-amber-600' />
                                <h4 className='font-semibold text-amber-800 dark:text-amber-400'>Attention Needed</h4>
                            </div>
                            <p className='mt-2 text-amber-700 text-sm dark:text-amber-300'>
                                Average wait time has increased by 12 minutes. Consider optimizing scheduling.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
