'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UserPen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { createNewAppointment } from '@/actions/appointment';
import { AppointmentSchema } from '@/schema';
import type { Doctor, Patient } from '@/types';
import { generateTimes } from '@/utils';

import { ProfileImage } from '../profile-image';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';

const APPOINTMENT_TYPES = [
    { label: 'General Consultation', value: 'General Consultation' },
    { label: 'General Check up', value: 'General Check Up' },
    { label: 'Antenatal', value: 'Antenatal' },
    { label: 'Maternity', value: 'Maternity' },
    { label: 'Lab Test', value: 'Lab Test' },
    { label: 'ANT', value: 'ANT' },
    { label: 'Follow-up', value: 'Follow-up' },
    { label: 'Emergency', value: 'Emergency' },
    { label: 'Vaccination', value: 'Vaccination' }
] as const;

interface BookAppointmentProps {
    data: Patient | undefined;
    doctors: Doctor[];
    onSuccess?: () => void;
}

export const BookAppointment = ({ data, doctors, onSuccess }: BookAppointmentProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const patientName = useMemo(
        () => `${data?.firstName || ''} ${data?.lastName || ''}`.trim(),
        [data?.firstName, data?.lastName]
    );

    const appointmentTimes = useMemo(() => generateTimes(8, 17, 30), []);

    const form = useForm<z.infer<typeof AppointmentSchema>>({
        resolver: zodResolver(AppointmentSchema),
        defaultValues: {
            doctorId: '',
            appointmentDate: new Date(),
            time: appointmentTimes[0]?.value || '',
            status: 'PENDING',
            type: 'CONSULTATION',
            note: ''
        }
    });

    const doctorId = form.watch('doctorId');
    const appointmentDate = form.watch('appointmentDate');
    const time = form.watch('time');

    const filteredDoctors = useMemo(() => {
        return doctors.filter(doctor => doctor.availabilityStatus === 'Available');
    }, [doctors]);

    const onSubmit: SubmitHandler<z.infer<typeof AppointmentSchema>> = useCallback(
        async values => {
            setIsSubmitting(true);

            try {
                const appointmentData = {
                    ...values,
                    patientId: data?.id ?? '',
                    // Ensure date is properly formatted
                    appointmentDate: values.appointmentDate ? new Date(values.appointmentDate) : new Date()
                };

                const result = await createNewAppointment(appointmentData);

                if (result?.data?.success || result?.data?.success) {
                    toast.success('Appointment booked successfully!', {
                        description: `Appointment scheduled for ${new Date(appointmentData.appointmentDate).toLocaleDateString()} at ${appointmentData.time}`
                    });

                    form.reset();
                    setIsOpen(false);
                    router.refresh();

                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    toast.error(result.data?.message || 'Failed to create appointment');
                }
            } catch (error) {
                console.error('Appointment booking error:', error);
                toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        },
        [data?.id, form, router, onSuccess]
    );

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // Reset form when sheet closes
            setTimeout(() => form.reset(), 300);
        }
    };

    const validateForm = () => {
        const values = form.getValues();
        if (!values.doctorId) {
            toast.error('Please select a physician');
            return false;
        }
        if (!values.time) {
            toast.error('Please select an appointment time');
            return false;
        }
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            form.handleSubmit(onSubmit)(e);
        }
    };

    return (
        <Sheet
            onOpenChange={handleOpenChange}
            open={isOpen}
        >
            <SheetTrigger asChild>
                <Button
                    className='flex w-full items-center justify-start gap-2 bg-blue-600 font-light text-sm text-white hover:bg-blue-700'
                    onClick={() => setIsOpen(true)}
                    variant='ghost'
                >
                    <UserPen size={16} /> Book Appointment
                </Button>
            </SheetTrigger>

            <SheetContent className='w-full rounded-r-2xl sm:max-w-md md:top-[2.5%] md:right-[1%] md:h-[95%] md:max-w-lg'>
                <div className='flex h-full flex-col'>
                    <SheetHeader className='border-b pb-4'>
                        <SheetTitle className='font-semibold text-xl'>Book Appointment</SheetTitle>
                        <p className='text-gray-500 text-sm'>Schedule an appointment for {patientName}</p>
                    </SheetHeader>

                    <div className='flex-1 overflow-y-auto p-4'>
                        <Form {...form}>
                            <form
                                className='space-y-6'
                                onSubmit={handleSubmit}
                            >
                                {/* Patient Info Card */}
                                <div className='flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                                    <ProfileImage
                                        bgColor={data?.colorCode || '#3B82F6'}
                                        className='size-16 border-2 border-white shadow-sm'
                                        name={patientName}
                                        textClassName='text-lg'
                                        url={data?.image || ''}
                                    />
                                    <div className='flex-1'>
                                        <p className='font-semibold text-lg'>{patientName}</p>
                                        <div className='mt-1 flex flex-wrap gap-2'>
                                            <span className='rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700 text-xs capitalize'>
                                                {data?.gender || 'Not specified'}
                                            </span>
                                            {data?.phone && (
                                                <span className='rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-xs'>
                                                    {data.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Type */}
                                <FormField
                                    control={form.control}
                                    name='type'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-medium'>Appointment Type *</FormLabel>
                                            <Select
                                                disabled={isSubmitting}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='h-11'>
                                                        <SelectValue placeholder='Select appointment type' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {APPOINTMENT_TYPES.map(type => (
                                                        <SelectItem
                                                            className='py-3'
                                                            key={type.value}
                                                            value={type.value}
                                                        >
                                                            {type.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Physician Selection */}
                                <FormField
                                    control={form.control}
                                    name='doctorId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-medium'>Physician *</FormLabel>
                                            <Select
                                                disabled={isSubmitting}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='h-11'>
                                                        <SelectValue placeholder='Select a physician' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='max-h-64'>
                                                    {filteredDoctors.length > 0 ? (
                                                        filteredDoctors.map(doctor => (
                                                            <SelectItem
                                                                className='py-3'
                                                                key={doctor.id}
                                                                value={doctor.id}
                                                            >
                                                                <div className='flex items-center gap-3'>
                                                                    <ProfileImage
                                                                        bgColor={doctor.colorCode || '#6B7280'}
                                                                        className='size-8'
                                                                        name={doctor.name}
                                                                        textClassName='text-xs'
                                                                        url={doctor.img || ''}
                                                                    />
                                                                    <div className='flex-1'>
                                                                        <p className='font-medium'>{doctor.name}</p>
                                                                        <p className='text-gray-500 text-xs'>
                                                                            {doctor.specialty} • {doctor.department}
                                                                        </p>
                                                                    </div>
                                                                    <span
                                                                        className={`ml-2 h-2 w-2 rounded-full ${doctor.availabilityStatus === 'Available' ? 'bg-green-500' : 'bg-gray-300'}`}
                                                                    />
                                                                </div>
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <div className='py-6 text-center text-gray-500 text-sm'>
                                                            No available physicians
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Date and Time */}
                                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                    <FormField
                                        control={form.control}
                                        name='appointmentDate'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-medium'>Date *</FormLabel>
                                                <FormControl>
                                                    <input
                                                        className='flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                                        disabled={isSubmitting}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        onChange={e => field.onChange(new Date(e.target.value))}
                                                        type='date'
                                                        value={
                                                            field.value instanceof Date
                                                                ? field.value.toISOString().split('T')[0]
                                                                : field.value
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='time'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='font-medium'>Time *</FormLabel>
                                                <Select
                                                    disabled={isSubmitting}
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className='h-11'>
                                                            <SelectValue placeholder='Select time' />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className='max-h-64'>
                                                        {appointmentTimes.map(timeSlot => (
                                                            <SelectItem
                                                                className='py-3'
                                                                key={timeSlot.value}
                                                                value={timeSlot.value}
                                                            >
                                                                {timeSlot.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Additional Notes */}
                                <FormField
                                    control={form.control}
                                    name='note'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='font-medium'>Additional Notes (Optional)</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    className='flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                                                    placeholder='Enter any additional notes or instructions...'
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Summary Section */}
                                {(doctorId || time) && (
                                    <div className='rounded-lg border border-blue-100 bg-blue-50 p-4'>
                                        <h4 className='font-medium text-blue-900'>Appointment Summary</h4>
                                        <div className='mt-2 space-y-1 text-sm'>
                                            {doctorId && (
                                                <p className='text-blue-700'>
                                                    <span className='font-medium'>Physician:</span>{' '}
                                                    {doctors.find(d => d.id === doctorId)?.name}
                                                </p>
                                            )}
                                            {appointmentDate && (
                                                <p className='text-blue-700'>
                                                    <span className='font-medium'>Date:</span>{' '}
                                                    {new Date(appointmentDate).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            )}
                                            {time && (
                                                <p className='text-blue-700'>
                                                    <span className='font-medium'>Time:</span> {time}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </form>
                        </Form>
                    </div>

                    {/* Footer with Submit Button */}
                    <div className='border-t bg-white p-4'>
                        <Button
                            className='w-full bg-blue-600 hover:bg-blue-700'
                            disabled={isSubmitting}
                            onClick={form.handleSubmit(onSubmit)}
                            size='lg'
                            type='submit'
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Booking...
                                </>
                            ) : (
                                'Book Appointment'
                            )}
                        </Button>
                        <p className='mt-2 text-center text-gray-500 text-xs'>
                            Appointment will be confirmed upon submission
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
