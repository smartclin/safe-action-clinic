import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DiagnosisWhereInput } from '@/generated/models';
import { formatDateTime } from '@/utils';
import { getDiagnosis } from '@/utils/services/medical';

interface DiagnosisContainerProps {
    patientId: string;
    doctorId: string;
    medicalId?: string;
    appointmentId?: string;
    clinicId?: string;
}

export const DiagnosisContainer = async ({
    patientId,
    doctorId,
    medicalId,
    appointmentId,
    clinicId
}: DiagnosisContainerProps) => {
    const where: DiagnosisWhereInput = { patientId, doctorId };

    if (medicalId) where.medicalId = medicalId;
    if (appointmentId) where.appointmentId = appointmentId;
    if (clinicId) where.clinicId = clinicId;

    const diagnoses = await getDiagnosis({ patientId, medicalId });
    if (diagnoses.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Diagnoses</CardTitle>
                    <CardDescription>No diagnoses found for this medical record</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground text-sm'>
                        No diagnoses have been recorded for this appointment.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-lg'>Diagnoses ({diagnoses.length})</h3>
                <Badge variant='outline'>{diagnoses[0]?.doctor?.name || 'Unknown Doctor'}</Badge>
            </div>

            {diagnoses.map(diagnosis => (
                <Card key={diagnosis.id}>
                    <CardHeader>
                        <div className='flex items-center justify-between'>
                            <CardTitle className='text-base'>
                                {diagnosis.diagnosis || 'Unspecified Diagnosis'}
                            </CardTitle>
                            <span className='text-muted-foreground text-xs'>{formatDateTime(diagnosis.date)}</span>
                        </div>
                        <CardDescription>
                            Type: {diagnosis.type || 'General'} • Symptoms: {diagnosis.symptoms || 'None recorded'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {diagnosis.treatment && (
                            <div>
                                <h4 className='font-medium text-sm'>Treatment</h4>
                                <p className='text-muted-foreground text-sm'>{diagnosis.treatment}</p>
                            </div>
                        )}
                        {diagnosis.notes && (
                            <div>
                                <h4 className='font-medium text-sm'>Notes</h4>
                                <p className='text-muted-foreground text-sm'>{diagnosis.notes}</p>
                            </div>
                        )}
                        {diagnosis.followUpPlan && (
                            <div>
                                <h4 className='font-medium text-sm'>Follow-up Plan</h4>
                                <p className='text-muted-foreground text-sm'>{diagnosis.followUpPlan}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
