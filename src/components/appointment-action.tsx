'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { appointmentAction } from '@/actions/appointment';
import type { AppointmentStatus } from '@/types';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface ActionProps {
    id: string;
    status: string;
}

export const AppointmentAction = ({ id, status }: ActionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState<AppointmentStatus | ''>('');
    const [reason, setReason] = useState('');
    const router = useRouter();

    const handleAction = async () => {
        try {
            setIsLoading(true);

            // Validate selection
            if (!selected) {
                toast.error('Please select an action');
                return;
            }

            // Provide a default reason if none provided
            const actionReason =
                reason.trim() || `Appointment ${selected.toLowerCase()} on ${new Date().toLocaleDateString()}`;

            // Call the server action with the correct format
            const result = await appointmentAction({
                id,
                status: selected,
                reason: actionReason
            });

            if (result) {
                toast.success(result.data?.success);
                setSelected('');
                setReason('');
                router.refresh();
            } else {
                toast.error(result || 'Failed to update appointment');
            }
        } catch (error) {
            console.error('Appointment action error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Disable buttons based on current status
    const isDisabled = (targetStatus: AppointmentStatus) => {
        return isLoading || status === targetStatus || status === 'COMPLETED';
    };

    return (
        <div className='space-y-4'>
            <div className='flex flex-wrap gap-2'>
                {(['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED'] as AppointmentStatus[]).map(action => (
                    <Button
                        className={`capitalize ${
                            action === 'PENDING'
                                ? 'bg-yellow-200 text-black hover:bg-yellow-300'
                                : action === 'SCHEDULED'
                                  ? 'bg-blue-200 text-black hover:bg-blue-300'
                                  : action === 'COMPLETED'
                                    ? 'bg-emerald-200 text-black hover:bg-emerald-300'
                                    : 'bg-red-200 text-black hover:bg-red-300'
                        }`}
                        disabled={isDisabled(action)}
                        key={action}
                        onClick={() => {
                            setSelected(action);
                            if (action !== 'CANCELLED') {
                                setReason('');
                            }
                        }}
                        variant='outline'
                    >
                        {action.toLowerCase()}
                    </Button>
                ))}
            </div>

            {selected === 'CANCELLED' && (
                <div className='space-y-2'>
                    <p className='font-medium text-sm'>Cancellation Reason (Required)</p>
                    <Textarea
                        className='min-h-[80px]'
                        disabled={isLoading}
                        minLength={10}
                        onChange={e => setReason(e.target.value)}
                        placeholder='Enter reason for cancellation...'
                        value={reason}
                    />
                    {!reason.trim() && <p className='text-red-500 text-sm'>Please provide a reason for cancellation</p>}
                </div>
            )}

            {selected && (
                <div className='space-y-4 rounded-lg border p-4'>
                    <div className='flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-blue-500' />
                        <p className='font-medium text-sm'>
                            Are you sure you want to mark this appointment as{' '}
                            <span className='font-bold text-primary'>{selected.toLowerCase()}</span>?
                        </p>
                    </div>

                    <div className='flex justify-end gap-2'>
                        <Button
                            disabled={isLoading}
                            onClick={() => {
                                setSelected('');
                                setReason('');
                            }}
                            variant='outline'
                        >
                            Cancel
                        </Button>
                        <Button
                            className={
                                selected === 'CANCELLED'
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : selected === 'COMPLETED'
                                      ? 'bg-emerald-600 hover:bg-emerald-700'
                                      : ''
                            }
                            disabled={isLoading || (selected === 'CANCELLED' && !reason.trim())}
                            onClick={handleAction}
                        >
                            {isLoading ? 'Updating...' : 'Confirm'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
