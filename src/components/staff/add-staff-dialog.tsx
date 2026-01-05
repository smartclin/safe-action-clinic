'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const staffSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.email('Invalid email address'),
    phone: z.string().min(10, 'Valid phone number is required'),
    role: z.enum(['DOCTOR', 'NURSE', 'ADMIN', 'STAFF']),
    department: z.string().min(1, 'Department is required'),
    specialty: z.string().optional(),
    licenseNumber: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
    notes: z.string().optional()
});

type StaffFormData = z.infer<typeof staffSchema>;

interface AddStaffDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddStaffDialog({ open, onOpenChange }: AddStaffDialogProps) {
    const form = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'STAFF',
            department: '',
            specialty: '',
            licenseNumber: '',
            address: '',
            emergencyContact: '',
            notes: ''
        }
    });

    const onSubmit = async (data: StaffFormData) => {
        try {
            const response = await fetch('/api/staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to add staff');

            toast.message('Staff added successfully', {
                description: `${data.firstName} ${data.lastName} has been added to the system.`
            });

            form.reset();
            onOpenChange(false);
            // Refresh staff list
            window.location.reload();
        } catch (_error) {
            toast.error('Failed to add staff member. Please try again.');
        }
    };

    const role = form.watch('role');

    return (
        <Dialog
            onOpenChange={onOpenChange}
            open={open}
        >
            <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>
                        Add a new doctor, nurse, or administrative staff to the clinic.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        className='space-y-4'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className='grid gap-4 sm:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='firstName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='John'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='lastName'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Doe'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid gap-4 sm:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='john.doe@clinic.com'
                                                type='email'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='phone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='(123) 456-7890'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='grid gap-4 sm:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='role'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role *</FormLabel>
                                        <Select
                                            defaultValue={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder='Select role' />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value='DOCTOR'>Doctor</SelectItem>
                                                <SelectItem value='NURSE'>Nurse</SelectItem>
                                                <SelectItem value='ADMIN'>Administrator</SelectItem>
                                                <SelectItem value='STAFF'>Staff</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name='department'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Pediatrics'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {role === 'DOCTOR' && (
                            <div className='grid gap-4 sm:grid-cols-2'>
                                <FormField
                                    control={form.control}
                                    name='specialty'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specialty</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Pediatric Cardiology'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='licenseNumber'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Medical License</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='MD-123456'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        <FormField
                            control={form.control}
                            name='address'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='123 Medical St, City, State'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='emergencyContact'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Emergency Contact</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='(123) 456-7890'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='notes'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className='min-h-[80px]'
                                            placeholder='Additional information...'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex justify-end gap-3 pt-4'>
                            <Button
                                onClick={() => onOpenChange(false)}
                                type='button'
                                variant='outline'
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={form.formState.isSubmitting}
                                type='submit'
                            >
                                {form.formState.isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                                Add Staff Member
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
