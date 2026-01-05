'use client';

import { Download, Filter, Plus, Upload } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function StaffActions() {
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const handleExport = (format: 'csv' | 'pdf') => {
        // Export logic
        console.log(`Exporting staff data as ${format}`);
    };

    return (
        <>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                {/* Search */}
                <div className='relative max-w-sm flex-1'>
                    <Input
                        className='pl-9'
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder='Search staff...'
                        value={searchQuery}
                    />
                    <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                </div>

                {/* Filters */}
                <div className='flex items-center gap-2'>
                    <Select
                        onValueChange={setFilterRole}
                        value={filterRole}
                    >
                        <SelectTrigger className='w-32'>
                            <SelectValue placeholder='Role' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>All Roles</SelectItem>
                            <SelectItem value='DOCTOR'>Doctor</SelectItem>
                            <SelectItem value='NURSE'>Nurse</SelectItem>
                            <SelectItem value='ADMIN'>Admin</SelectItem>
                            <SelectItem value='STAFF'>Staff</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        onValueChange={setFilterStatus}
                        value={filterStatus}
                    >
                        <SelectTrigger className='w-32'>
                            <SelectValue placeholder='Status' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>All Status</SelectItem>
                            <SelectItem value='ACTIVE'>Active</SelectItem>
                            <SelectItem value='INACTIVE'>Inactive</SelectItem>
                            <SelectItem value='ON_LEAVE'>On Leave</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        size='icon'
                        variant='outline'
                    >
                        <Filter className='h-4 w-4' />
                    </Button>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline'>
                                <Download className='mr-2 h-4 w-4' />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        onClick={() => setShowImportDialog(true)}
                        variant='outline'
                    >
                        <Upload className='mr-2 h-4 w-4' />
                        Import
                    </Button>

                    <Button onClick={() => setShowAddDialog(true)}>
                        <Plus className='mr-2 h-4 w-4' />
                        Add Staff
                    </Button>
                </div>
            </div>

            {/* Dialogs */}
            <AddStaffDialog
                onOpenChange={setShowAddDialog}
                open={showAddDialog}
            />
            <ImportStaffDialog
                onOpenChange={setShowImportDialog}
                open={showImportDialog}
            />
        </>
    );
}

import { Search } from 'lucide-react';

import { AddStaffDialog } from '@/components/staff/add-staff-dialog';
import { ImportStaffDialog } from '@/components/staff/import-staff-dialog';
