import { Pill } from 'lucide-react';

import { getPrescriptions } from '@/actions/medical';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { PrescriptionWhereInput } from '@/generated/models';
import { formatDateTime } from '@/utils';

interface PrescriptionsContainerProps {
    patientId: string;
    medicalRecordId: string;
    encounterId: string;
}

export const PrescriptionsContainer = async ({
    patientId,
    medicalRecordId,
    encounterId
}: PrescriptionsContainerProps) => {
    const where: PrescriptionWhereInput = { patientId };
    if (medicalRecordId) where.medicalRecordId = medicalRecordId;

    const prescriptions = await getPrescriptions(medicalRecordId, patientId, encounterId);

    if (prescriptions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Prescriptions</CardTitle>
                    <CardDescription>No prescriptions found</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col items-center justify-center py-8 text-center'>
                        <Pill className='h-12 w-12 text-muted-foreground/50' />
                        <p className='mt-4 text-muted-foreground'>
                            No prescriptions have been issued for this medical record.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-lg'>Prescriptions ({prescriptions.length})</h3>
                <Badge variant='outline'>{prescriptions.filter(p => p.status === 'active').length} Active</Badge>
            </div>

            {prescriptions.map(prescription => (
                <Card key={prescription.id}>
                    <CardHeader>
                        <div className='flex items-start justify-between'>
                            <div>
                                <CardTitle className='flex items-center gap-2 text-base'>
                                    <Pill className='h-4 w-4' />
                                    {prescription.medicationName}
                                </CardTitle>
                                <CardDescription>
                                    Issued by {prescription.doctor?.name || 'Unknown Doctor'} on{' '}
                                    {formatDateTime(prescription.issuedDate)}
                                </CardDescription>
                            </div>
                            <Badge variant={prescription.status === 'active' ? 'default' : 'secondary'}>
                                {prescription.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid gap-4 sm:grid-cols-2'>
                            <div>
                                <h4 className='font-medium text-sm'>Dosage</h4>
                                <p className='text-muted-foreground text-sm'>
                                    {prescription.prescribedItems[0]?.dosageValue}{' '}
                                    {prescription.prescribedItems[0]?.dosageUnit}
                                </p>
                            </div>
                            <div>
                                <h4 className='font-medium text-sm'>Frequency</h4>
                                <p className='text-muted-foreground text-sm'>
                                    {prescription.prescribedItems[0]?.frequency}
                                </p>
                            </div>
                            <div>
                                <h4 className='font-medium text-sm'>Duration</h4>
                                <p className='text-muted-foreground text-sm'>
                                    {prescription.prescribedItems[0]?.duration}
                                </p>
                            </div>
                            <div>
                                <h4 className='font-medium text-sm'>Instructions</h4>
                                <p className='text-muted-foreground text-sm'>{prescription.instructions || 'None'}</p>
                            </div>
                        </div>

                        {prescription.prescribedItems.length > 0 && (
                            <div>
                                <h4 className='mb-2 font-medium text-sm'>Prescribed Items</h4>
                                <div className='space-y-2'>
                                    {prescription.prescribedItems.map(item => (
                                        <div
                                            className='flex items-center justify-between border-b pb-2'
                                            key={item.id}
                                        >
                                            <span className='text-sm'>{item.drug?.name}</span>
                                            <span className='text-muted-foreground text-xs'>
                                                {item.dosageValue} {item.dosageUnit}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {prescription.endDate && (
                            <div className='border-t pt-2'>
                                <p className='text-muted-foreground text-sm'>
                                    Valid until: {formatDateTime(prescription.endDate)}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
