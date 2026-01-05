'use client';

import { Calendar, Mail, MapPin, Phone, Stethoscope, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { Staff, Status } from '@/types/staff';
import { formatDateTime, formatPhoneNumber } from '@/utils';

interface StaffDetailsDialogProps {
    staff: Staff;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function StaffDetailsDialog({ staff, open, onOpenChange }: StaffDetailsDialogProps) {
    const getStatusColor = (status: Status | null) => {
        if (!status) return 'bg-gray-500';
        switch (status) {
            case 'ACTIVE':
                return 'bg-emerald-500';
            case 'INACTIVE':
                return 'bg-red-500';
            case 'ON_LEAVE':
                return 'bg-amber-500';
            case 'DORMANT':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Dialog
            onOpenChange={onOpenChange}
            open={open}
        >
            <DialogContent className='max-w-2xl'>
                <DialogHeader>
                    <DialogTitle>Staff Details</DialogTitle>
                </DialogHeader>

                <div className='space-y-6'>
                    {/* Header */}
                    <div className='flex items-start gap-4'>
                        <Avatar className='h-16 w-16'>
                            <AvatarImage src={staff.avatar} />
                            <AvatarFallback className='text-lg'>
                                {staff.name
                                    .split(' ')
                                    .map(n => n[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <div className='flex items-start justify-between'>
                                <div>
                                    <h3 className='font-bold text-xl'>{staff.name}</h3>
                                    <div className='mt-1 flex items-center gap-2'>
                                        <Badge variant='secondary'>{staff.role}</Badge>
                                        <Badge className={`${getStatusColor(staff.status)} border-0 text-white`}>
                                            {staff.status ? staff.status.replace('_', ' ') : 'UNKNOWN'}
                                        </Badge>
                                    </div>
                                </div>
                                <Button
                                    size='sm'
                                    variant='outline'
                                >
                                    Edit
                                </Button>
                            </div>
                            <p className='mt-2 text-muted-foreground text-sm'>{staff.department}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Contact Information */}
                    <div className='grid gap-4 sm:grid-cols-2'>
                        <div className='space-y-3'>
                            <h4 className='font-semibold text-sm'>Contact Information</h4>
                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <Mail className='h-4 w-4 text-muted-foreground' />
                                    <span className='text-sm'>{staff.email || 'No email'}</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Phone className='h-4 w-4 text-muted-foreground' />
                                    <span className='text-sm'>
                                        {staff.phone ? formatPhoneNumber(staff.phone) : 'No phone'}
                                    </span>
                                </div>
                                {staff.address && (
                                    <div className='flex items-center gap-2'>
                                        <MapPin className='h-4 w-4 text-muted-foreground' />
                                        <span className='text-sm'>{staff.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='space-y-3'>
                            <h4 className='font-semibold text-sm'>Employment Details</h4>
                            <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                    <Calendar className='h-4 w-4 text-muted-foreground' />
                                    <div className='text-sm'>
                                        {staff.hireDate ? (
                                            <>
                                                <div>Hired: {formatDateTime(staff.hireDate)}</div>
                                                <div className='text-muted-foreground text-xs'>
                                                    (
                                                    {Math.floor(
                                                        (Date.now() - new Date(staff.hireDate).getTime()) /
                                                            (1000 * 60 * 60 * 24 * 365)
                                                    )}{' '}
                                                    years)
                                                </div>
                                            </>
                                        ) : (
                                            <div>Hire date not set</div>
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <User className='h-4 w-4 text-muted-foreground' />
                                    <span className='text-sm'>
                                        Last Active: {formatDateTime(staff.updatedAt ?? '')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Information (for doctors) */}
                    {staff.role === 'DOCTOR' && (staff.specialty || staff.licenseNumber) && (
                        <>
                            <Separator />
                            <div className='space-y-3'>
                                <h4 className='font-semibold text-sm'>Medical Information</h4>
                                <div className='flex items-center gap-4'>
                                    {staff.specialty && (
                                        <div className='flex items-center gap-2'>
                                            <Stethoscope className='h-4 w-4 text-muted-foreground' />
                                            <div>
                                                <div className='font-medium text-sm'>Specialty</div>
                                                <div className='text-muted-foreground text-sm'>{staff.specialty}</div>
                                            </div>
                                        </div>
                                    )}
                                    {staff.licenseNumber && (
                                        <div>
                                            <div className='font-medium text-sm'>License Number</div>
                                            <div className='text-muted-foreground text-sm'>{staff.licenseNumber}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Emergency Contact */}
                    {staff.emergencyContact && (
                        <>
                            <Separator />
                            <div className='space-y-3'>
                                <h4 className='font-semibold text-sm'>Emergency Contact</h4>
                                <div className='flex items-center gap-2'>
                                    <Phone className='h-4 w-4 text-muted-foreground' />
                                    <span className='text-sm'>{formatPhoneNumber(staff.emergencyContact)}</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Notes */}
                    {staff.notes && (
                        <>
                            <Separator />
                            <div className='space-y-3'>
                                <h4 className='font-semibold text-sm'>Notes</h4>
                                <p className='text-muted-foreground text-sm'>{staff.notes}</p>
                            </div>
                        </>
                    )}
                </div>

                <div className='flex justify-end gap-3 pt-4'>
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant='outline'
                    >
                        Close
                    </Button>
                    <Button>Schedule Appointment</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
