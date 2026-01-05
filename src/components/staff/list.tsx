'use client';

import type { VariantProps } from 'class-variance-authority';
import { Calendar, Mail, MoreVertical, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { DataTable } from '@/components/dashboard';
import { EditStaffDialog } from '@/components/staff/edit-staff-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge, type badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Column } from '@/components/ui/data-table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { Staff, Status } from '@/types/staff';
import { formatDateTime } from '@/utils';

import { StaffDetailsDialog } from './details-dialog';

interface StaffListProps {
    initialStaff: Staff[];
    initialPagination: {
        page: number;
        totalPages: number;
        totalItems: number;
    };
}

export function StaffList({ initialStaff, initialPagination }: StaffListProps) {
    const router = useRouter();
    const [staff, setStaff] = useState<Staff[]>(initialStaff);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const columns: Column<Staff>[] = [
        {
            key: 'name',
            header: 'Staff Member',
            render: staff => (
                <div className='flex items-center gap-3'>
                    <Avatar className='h-8 w-8'>
                        <AvatarImage src={staff.avatar} />
                        <AvatarFallback className='bg-primary/10 text-primary text-xs'>
                            {staff.name
                                .split(' ')
                                .map(n => n[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className='font-medium'>{staff.name}</p>
                        <p className='text-muted-foreground text-xs'>{staff.email || 'No email'}</p>
                    </div>
                </div>
            ),
            sortable: true,
            width: '25%'
        },
        {
            key: 'role',
            header: 'Role',
            render: staff => (
                <Badge
                    className='font-normal'
                    variant={staff.role === 'DOCTOR' ? 'default' : 'secondary'}
                >
                    {staff.role}
                </Badge>
            ),
            sortable: true
        },
        {
            key: 'department',
            header: 'Department',
            render: staff => staff.department || '—',
            sortable: true
        },
        {
            key: 'status',
            header: 'Status',
            render: staff => {
                const statusVariants: Record<Status, VariantProps<typeof badgeVariants>['variant']> = {
                    ACTIVE: 'default',
                    INACTIVE: 'destructive',
                    ON_LEAVE: 'secondary',
                    DORMANT: 'outline'
                };

                return (
                    <Badge
                        className='font-normal'
                        variant={staff.status ? statusVariants[staff.status] : 'outline'}
                    >
                        {staff.status ? staff.status.replace('_', ' ') : 'UNKNOWN'}
                    </Badge>
                );
            },
            sortable: true
        },
        {
            key: 'hireDate',
            header: 'Joined',
            render: staff => (staff.hireDate ? formatDateTime(staff.hireDate) : '—'),
            sortable: true
        },
        {
            key: 'actions',
            header: '',
            render: staff => (
                <div className='flex items-center gap-2'>
                    <Button
                        disabled={!staff.phone}
                        onClick={() => handleCall(staff.phone)}
                        size='icon-sm'
                        variant='ghost'
                    >
                        <Phone className='h-4 w-4' />
                    </Button>
                    <Button
                        disabled={!staff.email}
                        onClick={() => handleEmail(staff.email)}
                        size='icon-sm'
                        variant='ghost'
                    >
                        <Mail className='h-4 w-4' />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size='icon-sm'
                                variant='ghost'
                            >
                                <MoreVertical className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => handleViewDetails(staff)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(staff)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                                className='text-amber-600'
                                onClick={() => handleSchedule(staff.id)}
                            >
                                <Calendar className='mr-2 h-4 w-4' />
                                Schedule
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className='text-red-600'
                                onClick={() => handleDelete(staff)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            width: '140px'
        }
    ];

    const handleViewDetails = (staff: Staff) => {
        setSelectedStaff(staff);
        setDetailsDialogOpen(true);
    };

    const handleEdit = (staff: Staff) => {
        setSelectedStaff(staff);
        setEditDialogOpen(true);
    };

    const handleDelete = (staff: Staff) => {
        setSelectedStaff(staff);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedStaff) return;

        try {
            // API call to delete staff
            await fetch(`/api/staff/${selectedStaff.id}`, {
                method: 'DELETE'
            });

            setStaff(staff.filter(s => s.id !== selectedStaff.id));
            toast.success('Staff member deleted', {
                description: `${selectedStaff.name} has been removed from the system.`
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast.error('Failed to delete staff member', {
                description: errorMessage
            });
        } finally {
            setDeleteDialogOpen(false);
            setSelectedStaff(null);
        }
    };

    const handleCall = (phone: string | null) => {
        if (!phone) {
            toast.error('No phone number available');
            return;
        }
        window.location.href = `tel:${phone}`;
    };

    const handleEmail = (email: string | null) => {
        if (!email) {
            toast.error('No email available');
            return;
        }
        window.location.href = `mailto:${email}`;
    };

    const handleSchedule = (staffId: string) => {
        router.push(`/schedule?staffId=${staffId}`);
    };

    const handleBulkAction = (action: string) => {
        if (selectedRows.size === 0) {
            toast.error('No selection', {
                description: 'Please select staff members first.'
            });
            return;
        }

        switch (action) {
            case 'activate':
                // Bulk activate
                break;
            case 'deactivate':
                // Bulk deactivate
                break;
            case 'export':
                // Bulk export
                break;
        }
    };

    const handleRowSelect = (rowId: string, checked: boolean) => {
        const newSelected = new Set(selectedRows);
        if (checked) {
            newSelected.add(rowId);
        } else {
            newSelected.delete(rowId);
        }
        setSelectedRows(newSelected);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(new Set(staff.map(s => s.id)));
        } else {
            setSelectedRows(new Set());
        }
    };

    return (
        <>
            <DataTable<Staff>
                actions={
                    <div className='flex items-center gap-2'>
                        {selectedRows.size > 0 && (
                            <>
                                <span className='text-muted-foreground text-sm'>{selectedRows.size} selected</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                        >
                                            Bulk Actions
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                                            Activate Selected
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                                            Deactivate Selected
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                                            Export Selected
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        )}
                    </div>
                }
                columns={columns}
                data={staff}
                onRowClick={handleViewDetails}
                onSelectAll={handleSelectAll}
                onSelectRow={handleRowSelect}
                pagination={{
                    page: initialPagination.page,
                    totalPages: initialPagination.totalPages,
                    onPageChange: page => router.push(`/staff?page=${page}`),
                    totalItems: initialPagination.totalItems
                }}
                searchable
                selectable
                selectedRows={selectedRows}
            />

            {/* Details Dialog */}
            {selectedStaff && (
                <StaffDetailsDialog
                    onOpenChange={setDetailsDialogOpen}
                    open={detailsDialogOpen}
                    staff={selectedStaff}
                />
            )}

            {/* Edit Dialog */}
            {selectedStaff && (
                <EditStaffDialog
                    onOpenChange={setEditDialogOpen}
                    onSuccess={updatedStaff => {
                        setStaff(staff.map(s => (s.id === updatedStaff.id ? updatedStaff : s)));
                        setEditDialogOpen(false);
                    }}
                    open={editDialogOpen}
                    staff={selectedStaff}
                />
            )}

            {/* Delete Dialog */}
            <Dialog
                onOpenChange={setDeleteDialogOpen}
                open={deleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Staff Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedStaff?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='py-4'>
                        <div className='flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3'>
                            <Avatar className='h-10 w-10'>
                                <AvatarImage src={selectedStaff?.avatar} />
                                <AvatarFallback>
                                    {selectedStaff?.name
                                        ?.split(' ')
                                        .map(n => n[0])
                                        .join('')}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className='font-medium'>{selectedStaff?.name}</p>
                                <p className='text-muted-foreground text-sm'>{selectedStaff?.role}</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => setDeleteDialogOpen(false)}
                            variant='outline'
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            variant='destructive'
                        >
                            Delete Staff
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
