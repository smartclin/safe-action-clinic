import type { MedicalRecordsWhereInput } from '@/generated/models';
import db from '@/lib/db';

export async function getMedicalRecords({
    page,
    limit,
    search
}: {
    page: number | string;
    limit?: number | string;
    search?: string;
}) {
    'use cache';
    try {
        const PAGENUMBER = Number(page) <= 0 ? 1 : Number(page);
        const LIMIT = Number(limit) || 10;

        const SKIP = (PAGENUMBER - 1) * LIMIT;

        const where: MedicalRecordsWhereInput = {
            OR: [
                {
                    patient: {
                        firstName: { contains: search, mode: 'insensitive' }
                    }
                },
                {
                    patient: {
                        lastName: { contains: search, mode: 'insensitive' }
                    }
                },
                { patientId: { contains: search, mode: 'insensitive' } }
            ]
        };

        const [data, totalRecords] = await Promise.all([
            db.medicalRecords.findMany({
                where: where,
                include: {
                    patient: {
                        select: {
                            firstName: true,
                            lastName: true,
                            dateOfBirth: true,
                            image: true,
                            colorCode: true,
                            gender: true
                        }
                    },

                    encounter: {
                        include: {
                            doctor: {
                                select: {
                                    name: true,
                                    specialty: true,
                                    img: true,
                                    colorCode: true
                                }
                            }
                        }
                    },
                    labTest: true
                },
                skip: SKIP,
                take: LIMIT,
                orderBy: { createdAt: 'desc' }
            }),
            db.medicalRecords.count({
                where
            })
        ]);

        const totalPages = Math.ceil(totalRecords / LIMIT);

        return {
            success: true,
            data,
            totalRecords,
            totalPages,
            currentPage: PAGENUMBER,
            status: 200
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal Server Error', status: 500 };
    }
}
