import { BriefcaseBusiness } from 'lucide-react';

import { ViewAction } from '@/components/action-options';
import { DiagnosisContainer } from '@/components/appointment/diagnosis-container';
import { LabTestsContainer } from '@/components/medical/lab-tests-container';
import { PrescriptionsContainer } from '@/components/medical/prescriptions-container';
import { VitalSignsContainer } from '@/components/medical/vital-signs-container';
import { formatDateTime } from '@/utils';

import { MedicalHistoryDialog } from './medical-history-dialog';
import { ProfileImage } from './profile-image';
import { Table } from './tables/table';

export interface ExtendedMedicalHistory {
    id: string;
    encounterId: string;
    patientId: string;
    appointmentId: string;
    doctorId?: string | null;
    clinicId: string;
    diagnosis?: string | null;
    symptoms?: string | null;
    notes?: string | null;
    followUpDate?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    isDeleted?: boolean | null;

    // Relations
    patient?: {
        firstName: string;
        lastName: string;
        gender?: string;
        image?: string | null;
        dateOfBirth?: Date;
        colorCode?: string | null;
    };
    doctor?: {
        name: string;
        specialty?: string;
    };
    diagnoses?: Array<{
        id: string;
        diagnosis?: string | null;
        date: Date;
    }>;
    labTest?: Array<{
        id: string;
        testDate: Date;
        result?: string;
    }>;
    prescriptions?: Array<{
        id: string;
        medicationName: string;
    }>;
}

interface DataProps {
    data: ExtendedMedicalHistory[];
    isShowProfile?: boolean;
}

export const MedicalHistory = ({ data, isShowProfile }: DataProps) => {
    const columns = [
        {
            header: 'Record ID',
            key: 'id' as keyof ExtendedMedicalHistory,
            className: ''
        },
        {
            header: 'Patient Info',
            key: 'patient' as keyof ExtendedMedicalHistory,
            className: isShowProfile ? 'table-cell' : 'hidden'
        },
        {
            header: 'Date & Time',
            key: 'createdAt' as keyof ExtendedMedicalHistory,
            className: ''
        },
        {
            header: 'Doctor',
            key: 'doctor' as keyof ExtendedMedicalHistory,
            className: 'hidden xl:table-cell'
        },
        {
            header: 'Diagnosis',
            key: 'diagnoses' as keyof ExtendedMedicalHistory,
            className: 'hidden md:table-cell'
        },
        {
            header: 'Follow-up',
            key: 'followUpDate' as keyof ExtendedMedicalHistory,
            className: 'hidden lg:table-cell'
        },
        {
            header: 'Actions',
            key: 'id' as keyof ExtendedMedicalHistory, // Using id for actions column
            className: ''
        }
    ];

    const renderRow = (item: ExtendedMedicalHistory) => {
        const diagnosisCount = item.diagnoses?.length || 0;
        const prescriptionCount = item.prescriptions?.length || 0;

        return (
            <tr
                className='border-gray-200 border-b text-sm even:bg-slate-50 hover:bg-slate-50'
                key={item.id}
            >
                <td className='py-2 xl:py-6'>#{item.id.slice(0, 8)}</td>

                {isShowProfile && item.patient && (
                    <td className='flex items-center gap-2 py-2 xl:py-4 2xl:gap-4'>
                        <ProfileImage
                            name={`${item.patient.firstName} ${item.patient.lastName}`}
                            url={item.patient.image || ''}
                        />
                        <div>
                            <h3 className='font-semibold'>{`${item.patient.firstName} ${item.patient.lastName}`}</h3>
                            <span className='hidden text-xs capitalize md:flex'>
                                {item.patient.gender?.toLowerCase() || 'Unknown'}
                                {item.patient.dateOfBirth &&
                                    ` • ${new Date().getFullYear() - item.patient.dateOfBirth.getFullYear()} years`}
                            </span>
                        </div>
                    </td>
                )}

                <td className='py-2'>
                    <div className='space-y-1'>
                        <div>{formatDateTime(item.createdAt)}</div>
                        <div className='text-muted-foreground text-xs'>
                            Appointment: {item.appointmentId ? `#${item.appointmentId.slice(0, 8)}` : 'N/A'}
                        </div>
                    </div>
                </td>

                <td className='hidden items-center py-2 xl:table-cell'>
                    {item.doctor?.name || 'Dr. Unknown'}
                    {item.doctor?.specialty && (
                        <div className='text-muted-foreground text-xs'>{item.doctor.specialty}</div>
                    )}
                </td>

                <td className='hidden lg:table-cell'>
                    <div className='space-y-2'>
                        {diagnosisCount > 0 ? (
                            <MedicalHistoryDialog
                                appointmentId={item.appointmentId}
                                clinicId={item.clinicId}
                                diagnosisContent={
                                    <DiagnosisContainer
                                        doctorId={item.doctorId || ''}
                                        id={item.clinicId ?? ''}
                                        patientId={item.patientId}
                                    />
                                }
                                doctorId={item.doctorId || ''}
                                id={item.id}
                                label={
                                    <div className='flex items-center gap-2 text-blue-600'>
                                        <span className='font-medium'>{diagnosisCount}</span>
                                        <span className='text-sm'>diagnosis</span>
                                    </div>
                                }
                                labTestsContent={<LabTestsContainer medicalId={item.id ?? ''} />}
                                medicalId={item.id}
                                patientId={item.patientId}
                                prescriptionsContent={
                                    <PrescriptionsContainer
                                        encounterId={item.encounterId}
                                        medicalRecordId={item.id}
                                        patientId={item.patientId}
                                    />
                                }
                                vitalSignsContent={
                                    <VitalSignsContainer
                                        medicalId={item.id}
                                        patientId={item.patientId}
                                    />
                                }
                            />
                        ) : (
                            <span className='text-gray-500 text-sm italic'>No diagnosis</span>
                        )}

                        {prescriptionCount > 0 && (
                            <div className='text-sm'>
                                <span className='font-medium text-green-600'>{prescriptionCount}</span>
                                <span className='ml-1 text-muted-foreground'>prescriptions</span>
                            </div>
                        )}
                    </div>
                </td>

                <td className='hidden lg:table-cell'>
                    {item.followUpDate ? (
                        <div className='space-y-1'>
                            <div className='font-medium'>{formatDateTime(item.followUpDate)}</div>
                            <div className='text-muted-foreground text-xs'>
                                {new Date(item.followUpDate) > new Date() ? 'Upcoming' : 'Past due'}
                            </div>
                        </div>
                    ) : (
                        <span className='text-gray-500 text-sm italic'>No follow-up</span>
                    )}
                </td>

                <td>
                    <div className='flex items-center gap-2'>
                        <ViewAction href={`/medical-records/${item.id}`} />
                        <ViewAction href={`/appointments/${item.appointmentId}`} />
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className='rounded-xl bg-white p-2 2xl:p-6'>
            <div className='mb-6'>
                <h1 className='font-semibold text-xl'>Medical History</h1>
                <div className='mt-2 flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                        <BriefcaseBusiness
                            className='text-gray-500'
                            size={20}
                        />
                        <p className='font-semibold text-2xl'>{data.length}</p>
                        <span className='text-gray-600 text-sm xl:text-base'>total records</span>
                    </div>

                    {/* Summary Stats */}
                    <div className='hidden items-center gap-4 text-sm md:flex'>
                        <div className='flex items-center gap-1'>
                            <span className='font-medium text-blue-600'>
                                {data.reduce((acc, item) => acc + (item.diagnoses?.length || 0), 0)}
                            </span>
                            <span className='text-muted-foreground'>diagnoses</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <span className='font-medium text-green-600'>
                                {data.reduce((acc, item) => acc + (item.prescriptions?.length || 0), 0)}
                            </span>
                            <span className='text-muted-foreground'>prescriptions</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <span className='font-medium text-purple-600'>
                                {data.reduce((acc, item) => acc + (item.labTest?.length || 0), 0)}
                            </span>
                            <span className='text-muted-foreground'>lab tests</span>
                        </div>
                    </div>
                </div>
            </div>

            {data.length === 0 ? (
                <div className='rounded-lg border border-dashed p-8 text-center'>
                    <BriefcaseBusiness className='mx-auto h-12 w-12 text-muted-foreground/50' />
                    <h3 className='mt-4 font-semibold text-lg'>No Medical Records</h3>
                    <p className='mt-2 text-muted-foreground'>No medical history found for this patient.</p>
                </div>
            ) : (
                <Table
                    columns={columns}
                    data={data}
                    renderRow={renderRow}
                />
            )}
        </div>
    );
};
