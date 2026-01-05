// components/ui/appointment-action-dialog.tsx
'use client';

import { Ban, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GiConfirmed } from 'react-icons/gi';
import { MdCancel } from 'react-icons/md';
import { toast } from 'sonner';

import { appointmentAction } from '@/actions/appointment';
import { cn } from '@/lib/utils';
import type { AppointmentStatus } from '@/types';

import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';

interface ActionsProps {
    type: 'approve' | 'cancel';
    id: string;
    disabled?: boolean;
    onSuccess?: () => void;
}

const statusLabels: Record<AppointmentStatus, { label: string; color: string }> = {
    SCHEDULED: {
        label: 'Scheduled',
        color: 'text-blue-600 border-blue-600'
    },
    CANCELLED: {
        label: 'Cancelled',
        color: 'text-red-600 border-red-600'
    },
    COMPLETED: {
        label: 'Completed',
        color: 'text-emerald-600 border-emerald-600'
    },
    PENDING: {
        label: 'Pending',
        color: 'text-yellow-600 border-yellow-600'
    },
    NO_SHOW: {
        label: 'No Show',
        color: 'text-orange-600 border-orange-600'
    }
};

export const AppointmentActionDialog = ({ type, id, disabled = false, onSuccess }: ActionsProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [reason, setReason] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const handleAction = async () => {
        // Validate input
        if (type === 'cancel' && !reason.trim()) {
            toast.error('Please provide a reason for cancellation.');
            return;
        }

        try {
            setIsLoading(true);

            // Determine the status based on action type
            const status = type === 'approve' ? 'SCHEDULED' : 'CANCELLED';

            // Create the reason text
            const actionReason =
                reason.trim() ||
                `Appointment has been ${type === 'approve' ? 'scheduled' : 'cancelled'} on ${new Date().toLocaleDateString()}`;

            // Call the server action with proper input format
            const result = await appointmentAction({
                id,
                status,
                reason: actionReason
            });

            if (result.data?.success) {
                toast.success(result.data?.message);
                setReason('');
                setOpen(false); // Close dialog

                // Refresh the page data
                router.refresh();

                // Call the success callback if provided
                onSuccess?.();
            } else {
                toast.error(result.data?.message || 'Failed to update appointment');
            }
        } catch (error) {
            console.error('Appointment action error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            onOpenChange={setOpen}
            open={open}
        >
            <DialogTrigger asChild>
                {type === 'approve' ? (
                    <Button
                        className='w-full justify-start gap-2'
                        disabled={disabled}
                        size='sm'
                        variant='ghost'
                    >
                        <Check className='h-4 w-4' />
                        <span>Approve</span>
                    </Button>
                ) : (
                    <Button
                        className='flex w-full items-center justify-start gap-2 text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                        disabled={disabled}
                        size='sm'
                        variant='outline'
                    >
                        <Ban className='h-4 w-4' />
                        <span>Cancel</span>
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className='sm:max-w-md'>
                <div className='flex flex-col items-center justify-center py-6'>
                    {/* Icon */}
                    <DialogTitle className='mb-4'>
                        {type === 'approve' ? (
                            <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100'>
                                <GiConfirmed className='h-8 w-8 text-emerald-600' />
                            </div>
                        ) : (
                            <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100'>
                                <MdCancel className='h-8 w-8 text-red-600' />
                            </div>
                        )}
                    </DialogTitle>

                    {/* Title */}
                    <h3 className='mb-2 font-semibold text-gray-900 text-lg'>
                        Appointment {type === 'approve' ? 'Confirmation' : 'Cancellation'}
                    </h3>

                    {/* Description */}
                    <p className='mb-6 text-center text-gray-600 text-sm'>
                        {type === 'approve'
                            ? "You're about to confirm this appointment. Click 'Confirm' to approve or 'Cancel' to go back."
                            : 'Are you sure you want to cancel this appointment? Please provide a reason below.'}
                    </p>

                    {/* Reason input for cancellation */}
                    {type === 'cancel' && (
                        <div className='mb-6 w-full'>
                            <label
                                className='mb-2 block text-left font-medium text-gray-700 text-sm'
                                htmlFor='reason'
                            >
                                Cancellation Reason
                            </label>
                            <Textarea
                                className='min-h-[100px] w-full'
                                disabled={isLoading}
                                id='reason'
                                onChange={e => setReason(e.target.value)}
                                placeholder='Please provide a reason for cancellation...'
                                value={reason}
                            />
                            <p className='mt-1 text-left text-gray-500 text-xs'>
                                This reason will be recorded in the appointment history.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='mt-4 flex w-full items-center justify-center gap-3'>
                        <Button
                            className={cn(
                                'flex-1 font-medium',
                                type === 'approve'
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                            )}
                            disabled={isLoading || (type === 'cancel' && !reason.trim())}
                            onClick={handleAction}
                            type='button'
                        >
                            {isLoading ? (
                                <span className='flex items-center gap-2'>
                                    <span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                                    Processing...
                                </span>
                            ) : type === 'approve' ? (
                                'Confirm Appointment'
                            ) : (
                                'Cancel Appointment'
                            )}
                        </Button>

                        <DialogClose asChild>
                            <Button
                                className='flex-1'
                                disabled={isLoading}
                                type='button'
                                variant='outline'
                            >
                                Go Back
                            </Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Alternative: A more generic appointment status update component
interface AppointmentStatusUpdateProps {
    appointmentId: string;
    currentStatus: AppointmentStatus;
    allowedStatuses?: AppointmentStatus[];
    onUpdate?: (newStatus: AppointmentStatus) => void;
}

export const AppointmentStatusUpdate = ({
    appointmentId,
    currentStatus,
    allowedStatuses = ['SCHEDULED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'],
    onUpdate
}: AppointmentStatusUpdateProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const router = useRouter();

    const handleStatusUpdate = async () => {
        if (selectedStatus === 'CANCELLED' && !reason.trim()) {
            toast.error('Please provide a reason for cancellation.');
            return;
        }

        try {
            setIsLoading(true);

            const actionReason =
                reason.trim() ||
                `Appointment status updated to ${selectedStatus} on ${new Date().toLocaleDateString()}`;

            const result = await appointmentAction({
                id: appointmentId,
                status: selectedStatus as AppointmentStatus,
                reason: actionReason
            });

            if (result.data?.success) toast.success(result.data?.message);
            setReason('');
            setOpen(false);

            // Call the callback if provided
            onUpdate?.(selectedStatus);

            // Refresh the page
            router.refresh();
        } catch (error) {
            console.error('Appointment update error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            onOpenChange={setOpen}
            open={open}
        >
            <DialogTrigger asChild>
                <Button
                    size='sm'
                    variant='outline'
                >
                    Update Status
                </Button>
            </DialogTrigger>

            <DialogContent className='sm:max-w-lg'>
                <DialogTitle className='mb-4'>Update Appointment Status</DialogTitle>

                <div className='space-y-6'>
                    {/* Status Selection */}
                    <div>
                        <label
                            className='mb-2 block font-medium text-gray-700 text-sm'
                            htmlFor='status'
                        >
                            Select New Status
                        </label>
                        <div className='grid grid-cols-2 gap-2'>
                            {allowedStatuses.map(status => (
                                <button
                                    className={cn(
                                        'flex items-center justify-center gap-2 rounded-lg border p-3 font-medium text-sm transition-colors',
                                        selectedStatus === status
                                            ? `${statusLabels[status].color}border-current`
                                            : 'border-gray-300 hover:bg-gray-50'
                                    )}
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    type='button'
                                >
                                    {statusLabels[status].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reason Input (for cancellations) */}
                    {selectedStatus === 'CANCELLED' && (
                        <div>
                            <label
                                className='mb-2 block font-medium text-gray-700 text-sm'
                                htmlFor='reason'
                            >
                                Cancellation Reason
                            </label>
                            <Textarea
                                className='min-h-[100px]'
                                disabled={isLoading}
                                id='reason'
                                onChange={e => setReason(e.target.value)}
                                placeholder='Please provide a reason...'
                                value={reason}
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='flex justify-end gap-3'>
                        <Button
                            disabled={isLoading}
                            onClick={() => setOpen(false)}
                            type='button'
                            variant='outline'
                        >
                            Cancel
                        </Button>
                        <Button
                            className={cn(
                                selectedStatus === 'CANCELLED' && 'bg-red-600 hover:bg-red-700',
                                selectedStatus === 'COMPLETED' && 'bg-emerald-600 hover:bg-emerald-700'
                            )}
                            disabled={isLoading || (selectedStatus === 'CANCELLED' && !reason.trim())}
                            onClick={handleStatusUpdate}
                            type='button'
                        >
                            {isLoading ? 'Updating...' : 'Update Status'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
