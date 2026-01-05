// src/components/admin/billing/billing-dashboard.tsx
'use client';

import {
    AlertCircle,
    CheckCircle,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    FileText,
    Filter,
    TrendingUp,
    Users
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Invoice {
    id: string;
    patientName: string;
    amount: number;
    date: string;
    dueDate: string;
    status: 'paid' | 'pending' | 'overdue';
    paymentMethod?: string;
}

export function BillingDashboard() {
    const [timeRange, setTimeRange] = useState('month');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const invoices: Invoice[] = [
        {
            id: 'INV-001',
            patientName: 'Emma Johnson',
            amount: 150,
            date: '2024-12-15',
            dueDate: '2024-12-30',
            status: 'paid',
            paymentMethod: 'Credit Card'
        },
        {
            id: 'INV-002',
            patientName: 'Liam Chen',
            amount: 85,
            date: '2024-12-14',
            dueDate: '2024-12-29',
            status: 'pending',
            paymentMethod: 'Insurance'
        },
        {
            id: 'INV-003',
            patientName: 'Sophia Williams',
            amount: 220,
            date: '2024-12-13',
            dueDate: '2024-12-28',
            status: 'overdue',
            paymentMethod: 'Credit Card'
        },
        {
            id: 'INV-004',
            patientName: 'Noah Davis',
            amount: 180,
            date: '2024-12-12',
            dueDate: '2024-12-27',
            status: 'paid',
            paymentMethod: 'Cash'
        },
        {
            id: 'INV-005',
            patientName: 'Olivia Martinez',
            amount: 95,
            date: '2024-12-11',
            dueDate: '2024-12-26',
            status: 'pending',
            paymentMethod: 'Insurance'
        }
    ];

    const billingStats = {
        totalRevenue: 45280,
        outstandingAmount: 1250,
        averageInvoiceAmount: 146,
        collectionRate: 94.5
    };

    const getStatusBadge = (status: Invoice['status']) => {
        switch (status) {
            case 'paid':
                return <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>Paid</Badge>;
            case 'pending':
                return (
                    <Badge
                        className='bg-amber-100 text-amber-800'
                        variant='secondary'
                    >
                        Pending
                    </Badge>
                );
            case 'overdue':
                return <Badge variant='destructive'>Overdue</Badge>;
        }
    };

    const filteredInvoices =
        selectedStatus === 'all' ? invoices : invoices.filter(invoice => invoice.status === selectedStatus);

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-3xl tracking-tight'>Billing Management</h1>
                    <p className='text-muted-foreground'>Manage invoices, payments, and financial operations</p>
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

            {/* Time Range Selector */}
            <div className='flex items-center gap-4'>
                <Select
                    onValueChange={setTimeRange}
                    value={timeRange}
                >
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Select time range' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='today'>Today</SelectItem>
                        <SelectItem value='week'>This Week</SelectItem>
                        <SelectItem value='month'>This Month</SelectItem>
                        <SelectItem value='quarter'>This Quarter</SelectItem>
                        <SelectItem value='year'>This Year</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    onValueChange={setSelectedStatus}
                    value={selectedStatus}
                >
                    <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Filter by status' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='all'>All Status</SelectItem>
                        <SelectItem value='paid'>Paid</SelectItem>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='overdue'>Overdue</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Billing Stats */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Total Revenue</CardTitle>
                        <DollarSign className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-2xl'>${billingStats.totalRevenue.toLocaleString()}</div>
                        <div className='flex items-center text-xs'>
                            <TrendingUp className='mr-1 h-3 w-3 text-green-500' />
                            <span className='text-green-500'>+12.5%</span>
                            <span className='ml-1 text-muted-foreground'>from last month</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Outstanding</CardTitle>
                        <AlertCircle className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-2xl'>${billingStats.outstandingAmount}</div>
                        <p className='text-muted-foreground text-xs'>Amount pending collection</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Average Invoice</CardTitle>
                        <FileText className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-2xl'>${billingStats.averageInvoiceAmount}</div>
                        <p className='text-muted-foreground text-xs'>Per appointment</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='font-medium text-sm'>Collection Rate</CardTitle>
                        <CheckCircle className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-2xl'>{billingStats.collectionRate}%</div>
                        <p className='text-muted-foreground text-xs'>Successful collections</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs
                className='space-y-4'
                defaultValue='invoices'
            >
                <TabsList>
                    <TabsTrigger value='invoices'>Invoices</TabsTrigger>
                    <TabsTrigger value='payments'>Payments</TabsTrigger>
                    <TabsTrigger value='reports'>Reports</TabsTrigger>
                    <TabsTrigger value='settings'>Settings</TabsTrigger>
                </TabsList>

                <TabsContent value='invoices'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Invoices</CardTitle>
                            <CardDescription>Manage patient invoices and billing</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice ID</TableHead>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className='text-right'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInvoices.map(invoice => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className='font-medium font-mono'>{invoice.id}</TableCell>
                                            <TableCell className='font-medium'>{invoice.patientName}</TableCell>
                                            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                                            <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                            <TableCell className='text-right'>
                                                <Button
                                                    size='sm'
                                                    variant='ghost'
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='payments'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Processing</CardTitle>
                            <CardDescription>Process payments and manage payment methods</CardDescription>
                        </CardHeader>
                        <CardContent>{/* Payment processing content */}</CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Quick Actions */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Button
                    className='flex h-auto flex-col gap-2 py-4'
                    variant='outline'
                >
                    <FileText className='h-6 w-6' />
                    <span>Generate Invoice</span>
                </Button>
                <Button
                    className='flex h-auto flex-col gap-2 py-4'
                    variant='outline'
                >
                    <CreditCard className='h-6 w-6' />
                    <span>Process Payment</span>
                </Button>
                <Button
                    className='flex h-auto flex-col gap-2 py-4'
                    variant='outline'
                >
                    <Clock className='h-6 w-6' />
                    <span>Payment Reminders</span>
                </Button>
                <Button
                    className='flex h-auto flex-col gap-2 py-4'
                    variant='outline'
                >
                    <Users className='h-6 w-6' />
                    <span>Insurance Claims</span>
                </Button>
            </div>
        </div>
    );
}
