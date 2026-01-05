import { AppointmentDetails } from '@/components/appointment/appointment-details';
import AppointmentQuickLinks from '@/components/appointment/appointment-quick-links';
import { BillsContainer } from '@/components/appointment/bills-container';
import ChartContainer from '@/components/appointment/chart-container';
import { DiagnosisContainer } from '@/components/appointment/diagnosis-container';
import { PatientDetailsCard } from '@/components/appointment/patient-details-card';
import { PaymentsContainer } from '@/components/appointment/payment-container';
import { VitalSigns } from '@/components/appointment/vital-signs';
import { MedicalHistoryContainer } from '@/components/medical-history-container';
import type { Patient } from '@/types/patient';
import { getAppointmentWithMedicalRecordsById } from '@/utils/services/appointment';

const AppointmentDetailsPage = async ({
    params,
    searchParams
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const { id } = await params;
    const search = await searchParams;
    const cat = (search?.cat as string) || 'charts';

    const { data } = await getAppointmentWithMedicalRecordsById(id);

    return (
        <div className='flex min-h-screen w-full flex-col-reverse gap-10 p-6 lg:flex-row'>
            {/* LEFT */}
            <div className='flex w-full flex-col gap-6 lg:w-[65%]'>
                {cat === 'charts' && <ChartContainer id={data?.patientId ?? ''} />}
                {cat === 'appointments' && (
                    <>
                        <AppointmentDetails
                            appointmentDate={data?.appointmentDate ? new Date(data.appointmentDate) : new Date()}
                            id={data?.id ?? ''}
                            notes={data?.note ?? ''}
                            patientId={data?.patientId ?? ''}
                            time={data?.time ?? ''}
                        />

                        <VitalSigns
                            doctorId={data?.doctorId ?? ''}
                            id={id}
                            patientId={data?.patientId ?? ''}
                        />
                    </>
                )}
                {cat === 'diagnosis' && (
                    <DiagnosisContainer
                        doctorId={data?.doctorId ?? ''}
                        id={id}
                        patientId={data?.patientId ?? ''}
                    />
                )}
                {cat === 'medical-history' && (
                    <MedicalHistoryContainer
                        clinicId={id ?? ''}
                        patientId={data?.patientId ?? ''}
                    />
                )}
                {cat === 'billing' && <BillsContainer id={id} />}
                {cat === 'payments' && <PaymentsContainer patientId={data?.patientId ?? ''} />}
            </div>
            {/* RIGHT */}
            <div className='flex-1 space-y-6'>
                <AppointmentQuickLinks staffId={data?.doctorId ?? ''} />
                <PatientDetailsCard data={(data as unknown as { patient: Patient })?.patient} />
            </div>
        </div>
    );
};

export default AppointmentDetailsPage;
