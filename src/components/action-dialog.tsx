// components/ui/action-dialog.tsx
'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaQuestion } from 'react-icons/fa6';
import { toast } from 'sonner';

import { deleteDataById } from '@/actions/general';
import type { StaffData } from '@/types/data-types';

import { ProfileImage } from './profile-image';
import { SmallCard } from './small-card';
import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';

interface ActionDialogProps {
    type: 'view' | 'delete';
    id: string;
    data?: StaffData;
    deleteType?: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export const ActionDialog = ({ id, data, type, deleteType, onSuccess, onError }: ActionDialogProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    if (type === 'delete') {
        const handleDelete = async () => {
            try {
                setLoading(true);

                if (!deleteType) {
                    toast.error('Delete type is required');
                    return;
                }

                const result = await deleteDataById({
                    id,
                    deleteType
                });

                if (result.success) {
                    toast.success(result.message || 'Record deleted successfully');
                    setOpen(false);
                    router.refresh();
                    onSuccess?.();
                } else {
                    toast.error(result.message || 'Failed to delete record');
                    if (result.error && onError) {
                        onError(new Error(result.message));
                    }
                }
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('Something went wrong');
                onError?.(error as Error);
            } finally {
                setLoading(false);
            }
        };

        return (
            <Dialog
                onOpenChange={setOpen}
                open={open}
            >
                <DialogTrigger asChild>
                    <Button
                        className='flex items-center justify-center gap-2 rounded-full text-red-500 hover:text-red-600'
                        size='sm'
                        variant='ghost'
                    >
                        <Trash2 className='h-4 w-4' />
                        <span className='sr-only sm:not-sr-only sm:inline'>
                            {deleteType === 'patient' ? 'Delete Patient' : 'Delete'}
                        </span>
                    </Button>
                </DialogTrigger>

                <DialogContent className='sm:max-w-md'>
                    <div className='flex flex-col items-center justify-center py-6'>
                        <div className='mb-4'>
                            <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
                                <FaQuestion className='h-6 w-6 text-red-600' />
                            </div>
                            <DialogTitle className='text-center font-semibold text-gray-900 text-lg'>
                                Delete Confirmation
                            </DialogTitle>
                        </div>

                        <div className='mb-6 space-y-2 text-center'>
                            <p className='text-gray-600 text-sm'>Are you sure you want to delete this {deleteType}?</p>
                            <p className='font-medium text-red-600 text-sm'>This action cannot be undone.</p>
                        </div>

                        <div className='flex w-full items-center justify-center gap-3'>
                            <DialogClose asChild>
                                <Button
                                    className='flex-1'
                                    disabled={loading}
                                    variant='outline'
                                >
                                    Cancel
                                </Button>
                            </DialogClose>

                            <Button
                                className='flex-1 bg-red-600 text-white hover:bg-red-700'
                                disabled={loading}
                                onClick={handleDelete}
                            >
                                {loading ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    if (type === 'view' && data) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className='flex items-center justify-center gap-2 rounded-full text-blue-600 hover:text-blue-700'
                        size='sm'
                        variant='ghost'
                    >
                        <span>View Details</span>
                    </Button>
                </DialogTrigger>

                <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto p-6'>
                    <DialogTitle className='mb-6 font-semibold text-gray-900 text-xl'>Staff Information</DialogTitle>

                    {/* Header with profile info */}
                    <div className='flex items-start justify-between border-gray-200 border-b pb-6'>
                        <div className='flex items-center gap-4'>
                            <ProfileImage
                                bgColor={data.colorCode || '#3b82f6'}
                                className='h-20 w-20'
                                name={data.name}
                                textClassName='text-2xl'
                                url={data.img ?? ''}
                            />
                            <div className='space-y-1'>
                                <h3 className='font-semibold text-2xl text-gray-900'>{data.name}</h3>
                                <p className='text-gray-600 text-sm capitalize'>
                                    {data.role?.toLowerCase() || 'Staff'}
                                </p>
                                <p className='font-medium text-blue-600 text-sm'>
                                    {data.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                        </div>

                        <div className='text-right'>
                            <p className='text-gray-500 text-sm'>Staff ID</p>
                            <p className='font-mono font-semibold text-sm'>{data.id.slice(0, 8)}</p>
                        </div>
                    </div>

                    {/* Details section */}
                    <div className='mt-6 space-y-6'>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <SmallCard
                                label='Email Address'
                                value={data.email || 'N/A'}
                            />
                            <SmallCard
                                label='Phone Number'
                                value={data.phone || 'N/A'}
                            />
                        </div>

                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <SmallCard
                                label='Department'
                                value={data.department || 'N/A'}
                            />
                            <SmallCard
                                label='License Number'
                                value={data.licenseNumber || 'N/A'}
                            />
                        </div>

                        {data.address && (
                            <div>
                                <SmallCard
                                    label='Address'
                                    value={data.address}
                                />
                            </div>
                        )}

                        {/* Additional metadata */}
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <SmallCard
                                label='Account Created'
                                value={new Date(data.createdAt).toLocaleDateString()}
                            />
                            <SmallCard
                                label='Last Updated'
                                value={new Date(data.updatedAt).toLocaleDateString()}
                            />
                        </div>
                    </div>

                    <div className='mt-8 flex justify-end border-gray-200 border-t pt-6'>
                        <DialogClose asChild>
                            <Button variant='outline'>Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return null;
};

// Optional: Add a confirmation dialog component for reuse
export const DeleteConfirmationDialog = ({
    title,
    description,
    onConfirmAction,
    open,
    onOpenChangeAction
}: {
    title: string;
    description: string;
    onConfirmAction: () => void;
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
}) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirmAction();
            onOpenChangeAction(false);
        } catch (error) {
            console.error('Confirmation error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            onOpenChange={onOpenChangeAction}
            open={open}
        >
            <DialogContent className='sm:max-w-md'>
                <div className='flex flex-col items-center justify-center py-6'>
                    <div className='mb-4'>
                        <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
                            <FaQuestion className='h-6 w-6 text-red-600' />
                        </div>
                        <DialogTitle className='text-center font-semibold text-gray-900 text-lg'>{title}</DialogTitle>
                    </div>

                    <div className='mb-6 space-y-2 text-center'>
                        <p className='text-gray-600 text-sm'>{description}</p>
                        <p className='font-medium text-red-600 text-sm'>This action cannot be undone.</p>
                    </div>

                    <div className='flex w-full items-center justify-center gap-3'>
                        <DialogClose asChild>
                            <Button
                                className='flex-1'
                                disabled={loading}
                                variant='outline'
                            >
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            className='flex-1 bg-red-600 text-white hover:bg-red-700'
                            disabled={loading}
                            onClick={handleConfirm}
                        >
                            {loading ? 'Processing...' : 'Confirm'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
