import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';
import { checkRole } from '@/utils/roles';

import { AddDiagnosis } from '../dialogs/add-diagnosis';
import { NoDataFound } from '../no-data-found';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MedicalHistoryCard } from './medical-history-card';

export const DiagnosisContainer = async ({
    patientId,
    doctorId,
    id
}: {
    patientId: string;
    doctorId: string;
    id: string;
}) => {
    const session = await getSession();

    const userId = session?.user.id;

    if (!userId) redirect('/sign-in');

    const data = await db.medicalRecords.findFirst({
        where: { appointmentId: id },
        include: {
            encounter: {
                include: { doctor: true },
                orderBy: { createdAt: 'desc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const encounter = data?.encounter || null;
    const isPatient = await checkRole('PATIENT');

    return (
        <div>
            {encounter?.length === 0 || !encounter ? (
                <div className='mt-20 flex flex-col items-center justify-center'>
                    <NoDataFound note='No diagnosis found' />
                    <AddDiagnosis
                        appointmentId={id}
                        doctorId={doctorId}
                        key={Date.now()}
                        medicalId={data?.id.toString() || ''}
                        patientId={patientId}
                    />
                </div>
            ) : (
                <section className='space-y-6'>
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <CardTitle>Medical Records</CardTitle>

                            {!isPatient && (
                                <AddDiagnosis
                                    appointmentId={id}
                                    doctorId={doctorId}
                                    key={Date.now()}
                                    medicalId={data?.id.toString() || ''}
                                    patientId={patientId}
                                />
                            )}
                        </CardHeader>

                        <CardContent className='space-y-8'>
                            {encounter?.map((record, id) => (
                                <div key={record.id}>
                                    <MedicalHistoryCard
                                        index={id}
                                        record={record}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>
            )}
        </div>
    );
};
