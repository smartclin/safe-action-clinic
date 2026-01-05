// src/components/admin/medical-records/medical-records-list.tsx
'use client';

import { Calendar, Download, Edit, Eye, FileText, Filter, Search, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface MedicalRecordsWithPatient {
    id: string;
    patientName: string;
    patientId: string;
    age: string;
    recordType: 'consultation' | 'lab' | 'imaging' | 'vaccination' | 'surgery';
    date: string;
    provider: string;
    status: 'active' | 'archived' | 'pending';
    lastUpdated: string;
}

export function MedicalRecordsList() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('all');

    const records: MedicalRecordsWithPatient[] = [
        {
            id: 'REC001',
            patientName: 'Emma Johnson',
            patientId: 'PAT001',
            age: '3 years',
            recordType: 'consultation',
            date: '2024-12-15',
            provider: 'Dr. Sarah Johnson',
            status: 'active',
            lastUpdated: '2024-12-15 14:30'
        },
        {
            id: 'REC002',
            patientName: 'Liam Chen',
            patientId: 'PAT002',
            age: '2 months',
            recordType: 'vaccination',
            date: '2024-12-14',
            provider: 'Dr. Michael Chen',
            status: 'active',
            lastUpdated: '2024-12-14 11:15'
        },
        {
            id: 'REC003',
            patientName: 'Sophia Williams',
            patientId: 'PAT003',
            age: '5 years',
            recordType: 'lab',
            date: '2024-12-13',
            provider: 'Dr. Maria Rodriguez',
            status: 'pending',
            lastUpdated: '2024-12-13 16:45'
        },
        {
            id: 'REC004',
            patientName: 'Noah Davis',
            patientId: 'PAT004',
            age: '1 year',
            recordType: 'imaging',
            date: '2024-12-12',
            provider: 'Dr. James Wilson',
            status: 'active',
            lastUpdated: '2024-12-12 09:20'
        },
        {
            id: 'REC005',
            patientName: 'Olivia Martinez',
            patientId: 'PAT005',
            age: '4 years',
            recordType: 'surgery',
            date: '2024-12-11',
            provider: 'Dr. Lisa Kim',
            status: 'archived',
            lastUpdated: '2024-12-11 13:10'
        }
    ];

    const filteredRecords = records.filter(record => {
        const matchesSearch =
            record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || record.recordType === selectedType;
        return matchesSearch && matchesType;
    });

    const getRecordTypeBadge = (type: MedicalRecordsWithPatient['recordType']) => {
        const config = {
            consultation: { label: 'Consultation', color: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
            lab: { label: 'Lab Results', color: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
            imaging: { label: 'Imaging', color: 'bg-cyan-100 text-cyan-800 hover:bg-cyan-100' },
            vaccination: { label: 'Vaccination', color: 'bg-green-100 text-green-800 hover:bg-green-100' },
            surgery: { label: 'Surgery', color: 'bg-red-100 text-red-800 hover:bg-red-100' }
        };
        return <Badge className={config[type].color}>{config[type].label}</Badge>;
    };

    const getStatusBadge = (status: MedicalRecordsWithPatient['status']) => {
        switch (status) {
            case 'active':
                return <Badge variant='default'>Active</Badge>;
            case 'pending':
                return <Badge variant='secondary'>Pending</Badge>;
            case 'archived':
                return <Badge variant='outline'>Archived</Badge>;
            default:
                return null;
        }
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-3xl tracking-tight'>Medical Records</h1>
                    <p className='text-muted-foreground'>Manage and access patient medical records securely</p>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline'>
                        <Shield className='mr-2 h-4 w-4' />
                        Compliance Check
                    </Button>
                    <Button>
                        <FileText className='mr-2 h-4 w-4' />
                        New Record
                    </Button>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className='pt-6'>
                    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                        <div className='flex flex-1 items-center gap-4'>
                            <div className='relative flex-1'>
                                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                                <Input
                                    className='pl-9'
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder='Search records by patient name, ID, or record ID...'
                                    value={searchQuery}
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='outline'>
                                        <Filter className='mr-2 h-4 w-4' />
                                        Filter
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Record Type</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {['all', 'consultation', 'lab', 'imaging', 'vaccination', 'surgery'].map(type => (
                                        <DropdownMenuItem
                                            className={selectedType === type ? 'bg-accent' : ''}
                                            key={type}
                                            onClick={() => setSelectedType(type)}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Badge variant='outline'>Total: {records.length}</Badge>
                            <Button
                                size='sm'
                                variant='ghost'
                            >
                                <Download className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Records Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Medical Records</CardTitle>
                    <CardDescription>All patient medical records. Click to view details.</CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredRecords.length === 0 ? (
                        <div className='py-8 text-center'>
                            <FileText className='mx-auto h-12 w-12 text-muted-foreground' />
                            <h3 className='mt-4 font-medium text-lg'>No records found</h3>
                            <p className='mt-2 text-muted-foreground'>
                                {searchQuery ? 'No records match your search.' : 'No medical records available.'}
                            </p>
                            {searchQuery && (
                                <Button
                                    className='mt-4'
                                    onClick={() => setSearchQuery('')}
                                    variant='outline'
                                >
                                    Clear search
                                </Button>
                            )}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Record ID</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>Record Type</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Provider</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecords.map(record => (
                                    <TableRow
                                        className='hover:bg-accent/50'
                                        key={record.id}
                                    >
                                        <TableCell className='font-medium font-mono'>{record.id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className='font-medium'>{record.patientName}</div>
                                                <div className='flex items-center gap-1 text-muted-foreground text-sm'>
                                                    <User className='h-3 w-3' />
                                                    ID: {record.patientId} • {record.age}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getRecordTypeBadge(record.recordType)}</TableCell>
                                        <TableCell>
                                            <div className='flex items-center gap-2'>
                                                <Calendar className='h-3 w-3 text-muted-foreground' />
                                                {new Date(record.date).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>{record.provider}</TableCell>
                                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                                        <TableCell className='text-right'>
                                            <div className='flex justify-end gap-2'>
                                                <Button
                                                    asChild
                                                    size='sm'
                                                    variant='ghost'
                                                >
                                                    <Link href={`/admin/medical-records/${record.id}`}>
                                                        <Eye className='h-4 w-4' />
                                                        <span className='sr-only'>View</span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size='sm'
                                                    variant='ghost'
                                                >
                                                    <Edit className='h-4 w-4' />
                                                    <span className='sr-only'>Edit</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className='grid gap-4 md:grid-cols-3'>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='font-medium text-sm'>Active Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-2xl'>{records.filter(r => r.status === 'active').length}</div>
                        <p className='text-muted-foreground text-xs'>Currently accessible records</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='font-medium text-sm'>Records This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-2xl'>
                            {
                                records.filter(r => {
                                    const recordDate = new Date(r.date);
                                    const now = new Date();
                                    return (
                                        recordDate.getMonth() === now.getMonth() &&
                                        recordDate.getFullYear() === now.getFullYear()
                                    );
                                }).length
                            }
                        </div>
                        <p className='text-muted-foreground text-xs'>Created this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='font-medium text-sm'>Compliance Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='font-bold text-2xl text-green-600'>100%</div>
                        <p className='text-muted-foreground text-xs'>HIPAA compliant</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
