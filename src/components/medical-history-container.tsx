import type { MedicalRecordsWhereInput } from '@/generated/models';
import db from '@/lib/db';

import type { ExtendedMedicalHistory } from './medical-history';
import { MedicalHistory } from './medical-history';

interface DataProps {
    patientId: string;
    clinicId?: string;
    limit?: number;
}

export const MedicalHistoryContainer = async ({ patientId, clinicId, limit = 20 }: DataProps) => {
    try {
        const whereClause: MedicalRecordsWhereInput = {
            patientId,
            isDeleted: false
        };

        if (clinicId) {
            whereClause.clinicId = clinicId;
        }

        const data = await db.medicalRecords.findMany({
            where: whereClause,
            include: {
                patient: {
                    select: {
                        firstName: true,
                        lastName: true,
                        gender: true,
                        image: true,
                        dateOfBirth: true,
                        colorCode: true
                    }
                },
                doctor: {
                    select: {
                        name: true,
                        specialty: true
                    }
                },
                encounter: {
                    // This should be plural if it's an array
                    select: {
                        id: true,
                        diagnosis: true,
                        date: true
                    },
                    orderBy: { date: 'desc' }
                },
                labTest: {
                    select: {
                        id: true,
                        testDate: true,
                        result: true
                    },
                    orderBy: { testDate: 'desc' }
                },
                prescriptions: {
                    // Note: Capital P based on your Prisma schema
                    select: {
                        id: true,
                        medicationName: true,
                        issuedDate: true
                    },
                    orderBy: { issuedDate: 'desc' }
                },
                vitalSigns: {
                    // Capital V based on your Prisma schema
                    select: {
                        id: true,
                        recordedAt: true
                    },
                    orderBy: { recordedAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        // Ensure data is treated as an array
        if (!Array.isArray(data)) {
            throw new Error('Expected array from database query');
        }

        // Transform the data to match ExtendedMedicalHistory
        const transformedData: ExtendedMedicalHistory[] = data.map(record => ({
            id: record.id,
            encounterId: record.encounter[0]?.id ?? '',
            patientId: record.patientId,
            appointmentId: record.appointmentId,
            doctorId: record.doctorId,
            clinicId: record.clinicId,
            diagnosis: record.diagnosis,
            symptoms: record.symptoms,
            notes: record.notes,
            followUpDate: record.followUpDate,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            deletedAt: record.deletedAt,
            isDeleted: record.isDeleted,
            patient: record.patient
                ? {
                      firstName: record.patient.firstName,
                      lastName: record.patient.lastName,
                      gender: record.patient.gender,
                      image: record.patient.image,
                      dateOfBirth: record.patient.dateOfBirth,
                      colorCode: record.patient.colorCode
                  }
                : undefined,
            doctor: record.doctor
                ? {
                      name: record.doctor.name,
                      specialty: record.doctor.specialty
                  }
                : undefined,
            diagnoses: record.encounter, // Changed from 'encounter' to 'diagnoses'
            labTest: record.labTest,
            prescriptions: record.prescriptions
                ? record.prescriptions.map(p => ({
                      id: p.id,
                      medicationName: p.medicationName || 'Unknown Medication',
                      issuedDate: p.issuedDate
                  }))
                : undefined,
            vitalSigns: record.vitalSigns[0] // First vital signs record
                ? {
                      id: record.vitalSigns[0].id,
                      recordedAt: record.vitalSigns[0].recordedAt
                  }
                : undefined
        }));

        return (
            <MedicalHistory
                data={transformedData}
                isShowProfile={false}
            />
        );
    } catch (error) {
        console.error('Error fetching medical history:', error);
        return (
            <div className='rounded-lg border border-destructive/20 bg-destructive/5 p-6'>
                <h3 className='font-semibold text-destructive text-lg'>Error Loading Medical History</h3>
                <p className='mt-2 text-muted-foreground'>Unable to load medical records. Please try again later.</p>
            </div>
        );
    }
};
