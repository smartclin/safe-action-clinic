'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
// Form schema for service editing
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Clinic, Service } from '@/types';
import { deleteService, editService } from '@/utils/services/admin';

const serviceFormSchema = z.object({
    serviceName: z.string().min(1, 'Service name is required').max(100),
    description: z.string().optional().or(z.literal('')),
    price: z.coerce.number().min(0, 'Price cannot be negative').max(999999),
    category: z.string().min(1, 'Category is required'),
    duration: z.coerce.number().min(5, 'Minimum duration is 5 minutes').max(480, 'Maximum duration is 8 hours'),
    clinicId: z.string().optional().or(z.literal('')),
    isAvailable: z.boolean()
});

type ServiceFormValues = {
    serviceName: string;
    description: string;
    price: number;
    category: string;
    duration: number;
    clinicId: string;
    isAvailable: boolean;
};

export function EditService({ service, clinics }: { service: Service; clinics: Clinic[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const form = useForm<ServiceFormValues>({
        // biome-ignore lint/suspicious/noExplicitAny: Necessary due to Zod/Hook-Form inference mismatch in this version
        resolver: zodResolver(serviceFormSchema) as any,
        defaultValues: {
            serviceName: service.serviceName || '',
            description: service.description || '',
            price: Number(service.price) || 0,
            category: service.category || 'General',
            duration: service.duration || 30,
            clinicId: service.clinicId || '',
            isAvailable: service.isAvailable !== false
        }
    });

    const onSubmit = async (values: ServiceFormValues) => {
        startTransition(async () => {
            try {
                const result = await editService(service.id, {
                    ...values,
                    // Ensure price is handled correctly by Prisma (which expects Decimal/string)
                    price: values.price.toString()
                });

                if (result.success) {
                    toast.success(result.message || 'Service updated successfully');
                    setIsOpen(false);
                    form.reset(values);
                } else {
                    toast.error(result.message || 'Failed to update service');
                }
            } catch (error) {
                console.error('Failed to edit service', error);
                toast.error('An unexpected error occurred');
            }
        });
    };

    return (
        <Dialog
            onOpenChange={setIsOpen}
            open={isOpen}
        >
            <DialogTrigger asChild>
                <Button
                    className='h-8 w-8 rounded-md hover:bg-gray-100'
                    size='icon'
                    variant='ghost'
                >
                    <Pencil className='h-4 w-4 text-gray-600' />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                    <DialogTitle>Edit Service</DialogTitle>
                    <DialogDescription>Update the service details below.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        className='space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name='serviceName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder='Enter service name'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder='Enter service description'
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='price'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price ($) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                min='0'
                                                placeholder='0.00'
                                                step='0.01'
                                                type='number'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='duration'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration (minutes) *</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                min='5'
                                                placeholder='30'
                                                step='5'
                                                type='number'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <FormField
                                control={form.control}
                                name='category'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category *</FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select category' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='General'>General</SelectItem>
                                                <SelectItem value='Consultation'>Consultation</SelectItem>
                                                <SelectItem value='Procedure'>Procedure</SelectItem>
                                                <SelectItem value='Test'>Test</SelectItem>
                                                <SelectItem value='Vaccination'>Vaccination</SelectItem>
                                                <SelectItem value='Therapy'>Therapy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='clinicId'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Clinic</FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select clinic' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value=''>All Clinics</SelectItem>
                                                {clinics.map(clinic => (
                                                    <SelectItem
                                                        key={clinic.id}
                                                        value={clinic.id}
                                                    >
                                                        {clinic.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className='pt-4'>
                            <Button
                                disabled={isPending}
                                onClick={() => setIsOpen(false)}
                                type='button'
                                variant='outline'
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={isPending}
                                type='submit'
                            >
                                {isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export function DeleteService({ serviceId, serviceName }: { serviceId: string; serviceName: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                const result = await deleteService(serviceId);

                if (result.success) {
                    toast.success(`Service "${serviceName}" deleted successfully`);
                    setIsOpen(false);
                } else {
                    toast.error(result.message || 'Failed to delete service');
                }
            } catch (error) {
                console.error('Failed to delete service', error);
                toast.error('An unexpected error occurred');
            }
        });
    };

    return (
        <Dialog
            onOpenChange={setIsOpen}
            open={isOpen}
        >
            <DialogTrigger asChild>
                <Button
                    className='h-8 w-8 rounded-md hover:bg-red-50'
                    size='icon'
                    variant='ghost'
                >
                    <Trash2 className='h-4 w-4 text-red-600' />
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[400px]'>
                <DialogHeader>
                    <DialogTitle>Delete Service</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete the service and remove it from your
                        system.
                    </DialogDescription>
                </DialogHeader>

                <div className='py-4'>
                    <div className='rounded-md bg-red-50 p-4'>
                        <div className='flex'>
                            <div className='ml-3'>
                                <h3 className='font-medium text-red-800'>
                                    Are you sure you want to delete &quot;{serviceName}&quot;?
                                </h3>
                                <div className='mt-2 text-red-700 text-sm'>
                                    <p>All appointments and records associated with this service will be affected.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        disabled={isPending}
                        onClick={() => setIsOpen(false)}
                        type='button'
                        variant='outline'
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isPending}
                        onClick={handleDelete}
                        type='button'
                        variant='destructive'
                    >
                        {isPending ? 'Deleting...' : 'Delete Service'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Combined component for table actions
export function ServiceActions({ service, clinics }: { service: Service; clinics: Clinic[] }) {
    return (
        <div className='flex items-center gap-1'>
            <EditService
                clinics={clinics}
                service={service}
            />
            <DeleteService
                serviceId={service.id}
                serviceName={service.serviceName}
            />
        </div>
    );
}
