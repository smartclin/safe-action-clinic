// components/forms/new-patient.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Form, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';

import { createNewPatient, updatePatient } from '@/actions/patient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GENDER, MARITAL_STATUS, RELATION } from '@/lib';
import { authClient } from '@/lib/auth/client';
import { cn } from '@/lib/utils';
import { patientFormSchema } from '@/schema';
import type { Patient } from '@/types';

import { CustomInput } from './custom-input';

interface NewPatientProps {
    data?: Patient;
    type: 'create' | 'update';
}

export const NewPatient = ({ data, type }: NewPatientProps) => {
    const { data: session } = authClient.useSession();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Extract user data from Better Auth session
    const user = session?.user;

    const form = useForm<z.infer<typeof patientFormSchema>>({
        resolver: zodResolver(patientFormSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dateOfBirth: new Date(),
            gender: 'MALE',
            maritalStatus: 'single',
            nutritionalStatus: '',
            address: '',
            emergencyContactName: '',
            emergencyContactNumber: '',
            relation: 'mother',
            bloodGroup: '',
            allergies: '',
            medicalConditions: '',
            medicalHistory: '',
            insuranceNumber: '',
            insuranceProvider: '',
            privacyConsent: false,
            serviceConsent: false,
            medicalConsent: false
        }
    });

    const onSubmit: SubmitHandler<z.infer<typeof patientFormSchema>> = async values => {
        setLoading(true);

        try {
            let result;

            if (type === 'create') {
                // For create, we need to handle the form data appropriately
                result = await createNewPatient({
                    ...values,
                    clinicId: session?.user?.clinic?.id // Pass clinicId from session
                });
            } else {
                // For update, we need the patient ID
                if (!data?.id) {
                    toast.error('Patient ID is required for update');
                    setLoading(false);
                    return;
                }

                result = await updatePatient({
                    pid: data.id,
                    ...values
                });
            }

            // Handle the result based on next-safe-action response structure
            if (result?.data?.success) {
                toast.success(result.data.message || 'Patient saved successfully');
                form.reset();
                router.push('/patients');
                router.refresh();
            } else if (result.data?.error) {
                toast.error(result.data?.message || 'Failed to save patient');
            } else {
                toast.error('An unexpected error occurred');
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (type === 'create' && user?.name) {
            const nameParts = user.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            form.reset({
                ...form.getValues(),
                firstName,
                lastName,
                email: user.email || ''
            });
        } else if (type === 'update' && data) {
            form.reset({
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phone: data.phone || '',
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date(),
                gender: data.gender as 'MALE' | 'FEMALE',
                maritalStatus:
                    (data.maritalStatus as 'single' | 'married' | 'divorced' | 'widowed' | 'separated') || 'single',
                nutritionalStatus: data.nutritionalStatus || '',
                address: data.address || '',
                emergencyContactName: data.emergencyContactName || '',
                emergencyContactNumber: data.emergencyContactNumber || '',
                relation: (data.relation as 'mother' | 'father' | 'husband' | 'wife' | 'other') || 'mother',
                bloodGroup: data.bloodGroup || '',
                allergies: data.allergies || '',
                medicalConditions: data.medicalConditions || '',
                medicalHistory: data.medicalHistory || '',
                insuranceNumber: '',
                insuranceProvider: '',
                privacyConsent: false,
                serviceConsent: false,
                medicalConsent: false
            });
        }
    }, [type, data, user, form]);

    return (
        <Card className='w-full max-w-6xl p-4'>
            <CardHeader>
                <CardTitle>{type === 'create' ? 'New Patient Registration' : 'Update Patient Information'}</CardTitle>
                <CardDescription>
                    {type === 'create'
                        ? 'Please provide all the information below to help us understand better and provide good and quality service to you.'
                        : 'Update the patient information as needed.'}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <Form {...form}>
                    <form
                        className='mt-5 space-y-8'
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <h3 className='font-semibold text-lg'>Personal Information</h3>

                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <CustomInput
                                control={form.control}
                                disabled={loading}
                                label='First Name'
                                name='firstName'
                                placeholder='John'
                                required
                                type='input'
                            />
                            <CustomInput
                                control={form.control}
                                disabled={loading}
                                label='Last Name'
                                name='lastName'
                                placeholder='Doe'
                                required
                                type='input'
                            />
                        </div>

                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <CustomInput
                                control={form.control}
                                disabled={loading || type === 'update'}
                                inputType='email'
                                label='Email Address'
                                name='email'
                                placeholder='john@example.com'
                                required={type === 'create'}
                                type='input'
                            />
                            <CustomInput
                                control={form.control}
                                disabled={loading}
                                inputType='tel'
                                label='Contact Number'
                                name='phone'
                                placeholder='9225600735'
                                type='input'
                            />
                        </div>

                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <CustomInput
                                control={form.control}
                                disabled={loading}
                                label='Gender'
                                name='gender'
                                placeholder='Select gender'
                                required
                                selectList={GENDER}
                                type='select'
                            />

                            <div className='space-y-2'>
                                <label
                                    className='font-medium text-sm'
                                    htmlFor='date-of-birth-input'
                                >
                                    Date of Birth *
                                </label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !form.watch('dateOfBirth') && 'text-muted-foreground'
                                            )}
                                            disabled={loading}
                                            id='date-of-birth-input'
                                            type='button'
                                            variant='outline'
                                        >
                                            <CalendarIcon className='mr-2 h-4 w-4' />
                                            {form.watch('dateOfBirth') ? (
                                                format(form.watch('dateOfBirth'), 'PPP')
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0'>
                                        <Calendar
                                            disabled={loading}
                                            initialFocus
                                            mode='single'
                                            onSelect={(date: Date | undefined) =>
                                                form.setValue('dateOfBirth', date || new Date())
                                            }
                                            selected={form.watch('dateOfBirth')}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {form.formState.errors.dateOfBirth && (
                                    <p className='text-red-500 text-xs'>{form.formState.errors.dateOfBirth.message}</p>
                                )}
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <CustomInput
                                control={form.control}
                                disabled={loading}
                                label='Marital Status'
                                name='maritalStatus'
                                placeholder='Select marital status'
                                selectList={MARITAL_STATUS}
                                type='select'
                            />
                            <CustomInput
                                control={form.control}
                                disabled={loading}
                                label='Nutritional Status'
                                name='nutritionalStatus'
                                placeholder='Enter nutritional status'
                                type='input'
                            />
                        </div>

                        <CustomInput
                            control={form.control}
                            disabled={loading}
                            label='Address'
                            name='address'
                            placeholder='1479 Street, Apt 1839-G, NY'
                            rows={3}
                            type='textarea'
                        />

                        <div className='space-y-6'>
                            <h3 className='font-semibold text-lg'>Emergency Contact Information</h3>

                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                <CustomInput
                                    control={form.control}
                                    disabled={loading}
                                    label='Emergency Contact Name'
                                    name='emergencyContactName'
                                    placeholder='Anne Smith'
                                    type='input'
                                />
                                <CustomInput
                                    control={form.control}
                                    disabled={loading}
                                    inputType='tel'
                                    label='Emergency Contact Number'
                                    name='emergencyContactNumber'
                                    placeholder='675444467'
                                    type='input'
                                />
                            </div>

                            <CustomInput
                                control={form.control}
                                disabled={loading}
                                label='Relationship'
                                name='relation'
                                placeholder='Select relationship'
                                selectList={RELATION}
                                type='select'
                            />
                        </div>

                        <div className='space-y-6'>
                            <h3 className='font-semibold text-lg'>Medical Information</h3>

                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                <CustomInput
                                    control={form.control}
                                    disabled={loading}
                                    label='Blood Group'
                                    name='bloodGroup'
                                    placeholder='A+'
                                    type='input'
                                />
                                <CustomInput
                                    control={form.control}
                                    disabled={loading}
                                    label='Allergies'
                                    name='allergies'
                                    placeholder='Milk, Penicillin, etc.'
                                    rows={3}
                                    type='textarea'
                                />
                            </div>

                            <CustomInput
                                control={form.control}
                                disabled={loading}
                                label='Medical Conditions'
                                name='medicalConditions'
                                placeholder='Asthma, Diabetes, etc.'
                                rows={3}
                                type='textarea'
                            />

                            <CustomInput
                                control={form.control}
                                disabled={loading}
                                label='Medical History'
                                name='medicalHistory'
                                placeholder='Previous surgeries, treatments, etc.'
                                rows={3}
                                type='textarea'
                            />

                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                <CustomInput
                                    control={form.control}
                                    disabled={loading}
                                    label='Insurance Provider'
                                    name='insuranceProvider'
                                    placeholder='Insurance company name'
                                    type='input'
                                />
                                <CustomInput
                                    control={form.control}
                                    disabled={loading}
                                    label='Insurance Number'
                                    name='insuranceNumber'
                                    placeholder='Insurance policy number'
                                    type='input'
                                />
                            </div>
                        </div>

                        {type === 'create' && (
                            <div className='space-y-6'>
                                <h3 className='font-semibold text-lg'>Consent Forms</h3>

                                <div className='space-y-4 rounded-lg border p-4'>
                                    <CustomInput
                                        control={form.control}
                                        description='I consent to the collection, storage, and use of my personal and health information as outlined in the Privacy Policy.'
                                        disabled={loading}
                                        label='Privacy Consent'
                                        name='privacyConsent'
                                        required
                                        type='checkbox'
                                    />

                                    <CustomInput
                                        control={form.control}
                                        description='I agree to the Terms of Service for using this healthcare management system.'
                                        disabled={loading}
                                        label='Service Consent'
                                        name='serviceConsent'
                                        required
                                        type='checkbox'
                                    />

                                    <CustomInput
                                        control={form.control}
                                        description='I provide informed consent to receive medical treatment and services through this healthcare management system.'
                                        disabled={loading}
                                        label='Medical Consent'
                                        name='medicalConsent'
                                        required
                                        type='checkbox'
                                    />
                                </div>
                            </div>
                        )}

                        <div className='flex gap-4 pt-6'>
                            <Button
                                className='min-w-32'
                                disabled={loading}
                                type='submit'
                            >
                                {loading ? (
                                    <>
                                        <span className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                                        {type === 'create' ? 'Creating...' : 'Updating...'}
                                    </>
                                ) : type === 'create' ? (
                                    'Create Patient'
                                ) : (
                                    'Update Patient'
                                )}
                            </Button>

                            <Button
                                disabled={loading}
                                onClick={() => router.back()}
                                type='button'
                                variant='outline'
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
