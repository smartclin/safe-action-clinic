'use client';

import type React from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DataProps {
    id: string;
    patientId: string;
    medicalId?: string;
    doctorId: string;
    label: React.ReactNode;
    appointmentId?: string;
    clinicId?: string;
    // Server Component Slots
    diagnosisContent?: React.ReactNode;
    prescriptionsContent?: React.ReactNode;
    labTestsContent?: React.ReactNode;
    vitalSignsContent?: React.ReactNode;
}

export const MedicalHistoryDialog = ({
    patientId,
    label,
    medicalId,
    diagnosisContent,
    prescriptionsContent,
    labTestsContent,
    vitalSignsContent
}: DataProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog
            onOpenChange={setOpen}
            open={open}
        >
            <DialogTrigger asChild>
                <Button
                    className='flex items-center justify-center rounded-full bg-blue-600/10 px-1.5 py-1 text-blue-600 text-xs hover:underline md:text-sm'
                    variant='outline'
                >
                    {label}
                </Button>
            </DialogTrigger>
            <DialogContent className='max-h-[90vh] max-w-[425px] overflow-hidden p-0 md:max-w-4xl 2xl:max-w-6xl'>
                <div className='flex h-full flex-col'>
                    <DialogHeader className='border-b p-6'>
                        <DialogTitle>Medical Record Details</DialogTitle>
                        <DialogDescription>
                            Patient ID: {patientId} • Record ID: {medicalId || 'N/A'}
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs
                        className='flex-1 overflow-hidden'
                        defaultValue='diagnosis'
                    >
                        <div className='border-b px-6'>
                            <TabsList className='h-auto w-full justify-start space-x-4'>
                                <TabsTrigger value='diagnosis'>Diagnosis</TabsTrigger>
                                <TabsTrigger value='prescriptions'>Prescriptions</TabsTrigger>
                                <TabsTrigger value='lab-tests'>Lab Tests</TabsTrigger>
                                <TabsTrigger value='vital-signs'>Vital Signs</TabsTrigger>
                                <TabsTrigger value='notes'>Notes</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className='flex-1 overflow-y-auto p-6'>
                            <TabsContent
                                className='mt-0 space-y-4'
                                value='diagnosis'
                            >
                                {diagnosisContent}
                            </TabsContent>

                            <TabsContent
                                className='mt-0'
                                value='prescriptions'
                            >
                                {prescriptionsContent}
                            </TabsContent>

                            <TabsContent
                                className='mt-0'
                                value='lab-tests'
                            >
                                {labTestsContent}
                            </TabsContent>

                            <TabsContent
                                className='mt-0'
                                value='vital-signs'
                            >
                                {vitalSignsContent}
                            </TabsContent>

                            <TabsContent
                                className='mt-0'
                                value='notes'
                            >
                                <div className='rounded-lg border p-4'>
                                    <h3 className='font-semibold text-lg'>Clinical Notes</h3>
                                    <p className='mt-2 text-muted-foreground text-sm'>
                                        Additional notes from the medical record will appear here.
                                    </p>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
};
