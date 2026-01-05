// src/components/appointment/vital-signs-container.tsx
import { Activity } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/utils';
import { getVitalSigns } from '@/utils/services/medical';

interface VitalSignsContainerProps {
    patientId: string;
    medicalId?: string;
}

// ✅ Server Component (no 'use client')
export const VitalSignsContainer = async ({ patientId, medicalId }: VitalSignsContainerProps) => {
    const vitalSigns = await getVitalSigns({ patientId, medicalId });

    if (vitalSigns.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Vital Signs</CardTitle>
                    <CardDescription>No vital signs recorded</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col items-center justify-center py-8 text-center'>
                        <Activity className='h-12 w-12 text-muted-foreground/50' />
                        <p className='mt-4 text-muted-foreground'>
                            No vital signs have been recorded for this medical record.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-lg'>Vital Signs ({vitalSigns.length})</h3>
                <Badge variant='outline'>
                    Latest: {formatDateTime(vitalSigns[0]?.recordedAt.toDateString() ?? '')}
                </Badge>
            </div>

            {vitalSigns.map(vitals => (
                <Card key={vitals.id}>
                    <CardHeader>
                        <div className='flex items-start justify-between'>
                            <div>
                                <CardTitle className='flex items-center gap-2 text-base'>
                                    <Activity className='h-4 w-4' />
                                    Vital Signs Measurement
                                </CardTitle>
                                <CardDescription>Recorded: {formatDateTime(vitals?.recordedAt)}</CardDescription>
                            </div>
                            {vitals?.ageDays && (
                                <Badge variant='secondary'>{Math.floor(vitals.ageDays / 30)} months</Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                            {/* Core Vitals */}
                            {vitals.bodyTemperature !== null && (
                                <div>
                                    <h4 className='font-medium text-sm'>Temperature</h4>
                                    <p className='text-muted-foreground text-sm'>{vitals.bodyTemperature}°C</p>
                                </div>
                            )}
                            {vitals.systolic !== null && vitals.diastolic !== null && (
                                <div>
                                    <h4 className='font-medium text-sm'>Blood Pressure</h4>
                                    <p className='text-muted-foreground text-sm'>
                                        {vitals.systolic}/{vitals.diastolic} mmHg
                                    </p>
                                </div>
                            )}
                            {vitals?.heartRate && (
                                <div>
                                    <h4 className='font-medium text-sm'>Heart Rate</h4>
                                    <p className='text-muted-foreground text-sm'>{vitals?.heartRate} BPM</p>
                                </div>
                            )}
                            {vitals?.respiratoryRate !== null && (
                                <div>
                                    <h4 className='font-medium text-sm'>Respiratory Rate</h4>
                                    <p className='text-muted-foreground text-sm'>
                                        {vitals.respiratoryRate} breaths/min
                                    </p>
                                </div>
                            )}
                            {vitals.oxygenSaturation !== null && (
                                <div>
                                    <h4 className='font-medium text-sm'>Oxygen Saturation</h4>
                                    <p className='text-muted-foreground text-sm'>{vitals.oxygenSaturation}%</p>
                                </div>
                            )}

                            {/* Growth Measurements */}
                            {vitals.height !== null && (
                                <div>
                                    <h4 className='font-medium text-sm'>Height</h4>
                                    <p className='text-muted-foreground text-sm'>{vitals.height} cm</p>
                                </div>
                            )}
                            {vitals.weight !== null && (
                                <div>
                                    <h4 className='font-medium text-sm'>Weight</h4>
                                    <p className='text-muted-foreground text-sm'>{vitals.weight} kg</p>
                                </div>
                            )}
                            {vitals.headCircumference !== null && (
                                <div>
                                    <h4 className='font-medium text-sm'>Head Circumference</h4>
                                    <p className='text-muted-foreground text-sm'>
                                        {vitals.headCircumference.toString()} cm
                                    </p>
                                </div>
                            )}
                            {vitals.bmi !== null && (
                                <div>
                                    <h4 className='font-medium text-sm'>BMI</h4>
                                    <p className='text-muted-foreground text-sm'>{vitals.bmi.toString()}</p>
                                </div>
                            )}

                            {/* WHO Percentiles */}
                            {vitals.weightForAgeZ !== null && (
                                <div>
                                    <h4 className='font-medium text-sm'>Weight Z-Score</h4>
                                    <p className='text-muted-foreground text-sm'>{vitals.weightForAgeZ.toString()}</p>
                                </div>
                            )}
                            {vitals.heightForAgeZ !== null && (
                                <div>
                                    <h4 className='font-medium text-sm'>Height Z-Score</h4>
                                    <p className='text-muted-foreground text-sm'>{vitals.heightForAgeZ.toString()}</p>
                                </div>
                            )}
                            {vitals.hcForAgeZ !== null && (
                                <div>
                                    <h4 className='font-medium text-sm'>Head Circumference Z-Score</h4>
                                    <p className='text-muted-foreground text-sm'>{vitals.hcForAgeZ.toString()}</p>
                                </div>
                            )}
                        </div>

                        {vitals.notes && (
                            <div className='mt-4 border-t pt-4'>
                                <h4 className='font-medium text-sm'>Notes</h4>
                                <p className='text-muted-foreground text-sm'>{vitals.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
