import { endOfMonth, format, getMonth, startOfYear } from 'date-fns';

import db from '@/lib/db';
import type { AppointmentStatus } from '@/types';
import { daysOfWeek } from '@/utils';

interface Appointment {
    status: AppointmentStatus | null;
    appointmentDate: Date;
}

function isValidStatus(status: string): status is AppointmentStatus {
    return ['PENDING', 'SCHEDULED', 'COMPLETED', 'NO_SHOW', 'CANCELLED'].includes(status);
}

const initializeMonthlyData = () => {
    const this_year = new Date().getFullYear();

    const months = Array.from({ length: getMonth(new Date()) + 1 }, (_, index) => ({
        name: format(new Date(this_year, index), 'MMM'),
        appointment: 0,
        completed: 0,
        noShow: 0,
        cancelled: 0
    }));
    return months;
};

export const processAppointments = async (appointments: Appointment[]) => {
    const monthlyData = initializeMonthlyData();

    const appointmentCounts = appointments.reduce<Record<AppointmentStatus, number>>(
        (acc, appointment) => {
            const status = appointment?.status ?? 'PENDING';

            const appointmentDate = appointment.appointmentDate;
            if (!appointmentDate) return acc; // <-- prevent undefined0

            const monthIndex = getMonth(appointmentDate);

            if (appointmentDate >= startOfYear(new Date()) && appointmentDate <= endOfMonth(new Date())) {
                if (monthlyData[monthIndex]) {
                    monthlyData[monthIndex].appointment += 1;

                    if (status === 'COMPLETED') {
                        monthlyData[monthIndex].completed += 1;
                    }

                    if (status === 'NO_SHOW') {
                        monthlyData[monthIndex].noShow += 1;
                    }

                    if (status === 'CANCELLED') {
                        monthlyData[monthIndex].cancelled += 1;
                    }
                }
            }

            // Grouping by status
            if (isValidStatus(status)) {
                acc[status] = (acc[status] || 0) + 1;
            }

            return acc;
        },
        {
            PENDING: 0,
            SCHEDULED: 0,
            COMPLETED: 0,
            NO_SHOW: 0,
            CANCELLED: 0
        }
    );

    return { appointmentCounts, monthlyData };
};

export async function getPatientDashboardStatistics(id: string) {
    try {
        if (!id) {
            return {
                success: false,
                message: 'No data found',
                data: null
            };
        }

        const data = await db.patient.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                gender: true,
                image: true,
                colorCode: true
            }
        });

        if (!data) {
            return {
                success: false,
                message: 'Patient data not found',
                status: 200,
                data: null
            };
        }

        const appointments = await db.appointment.findMany({
            where: { patientId: data?.id },
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        img: true,
                        specialty: true,
                        colorCode: true
                    }
                },
                patient: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        gender: true,
                        dateOfBirth: true,
                        image: true,
                        colorCode: true
                    }
                }
            },

            orderBy: { appointmentDate: 'desc' }
        });

        const { appointmentCounts, monthlyData } = await processAppointments(appointments);
        const last5Records = appointments.slice(0, 5);

        const today = daysOfWeek[new Date().getDay()];

        const availableDoctor = await db.doctor.findMany({
            select: {
                name: true,
                specialty: true,
                img: true,
                workingDays: true,
                colorCode: true
            },
            where: {
                workingDays: {
                    some: {
                        day: {
                            equals: today,
                            mode: 'insensitive'
                        }
                    }
                }
            },
            take: 4
        });

        return {
            success: true,
            data,
            appointmentCounts,
            last5Records,
            totalAppointments: appointments.length,
            availableDoctor,
            monthlyData,
            status: 200
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal Server Error', status: 500 };
    }
}

export async function getPatientById(id: string) {
    try {
        const patient = await db.patient.findUnique({
            where: { userId: id }
        });

        if (!patient) {
            return {
                success: false,
                message: 'Patient data not found',
                status: 200,
                data: null
            };
        }

        return { success: true, data: patient, status: 200 };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal Server Error', status: 500, data: null };
    }
}

export async function getPatientFullDataById(id: string) {
    try {
        const patient = await db.patient.findFirst({
            where: {
                OR: [
                    {
                        id
                    },
                    { email: id }
                ]
            },
            include: {
                _count: {
                    select: {
                        appointments: true
                    }
                },
                appointments: {
                    select: {
                        appointmentDate: true
                    },
                    orderBy: {
                        appointmentDate: 'desc'
                    },
                    take: 1
                }
            }
        });

        if (!patient) {
            return {
                success: false,
                message: 'Patient data not found',
                status: 404
            };
        }
        const lastVisit = patient.appointments[0]?.appointmentDate || null;

        return {
            success: true,
            data: {
                ...patient,
                totalAppointments: patient._count.appointments,
                lastVisit
            },
            status: 200
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal Server Error', status: 500 };
    }
}

export async function getAllPatients({
    page,
    limit,
    search
}: {
    page: number | string;
    limit?: number | string;
    search?: string;
}) {
    try {
        const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
        const LIMIT = Number(limit) || 10;

        const SKIP = (PAGE_NUMBER - 1) * LIMIT;

        const [patients, totalRecords] = await Promise.all([
            db.patient.findMany({
                where: {
                    OR: [
                        { firstName: { contains: search, mode: 'insensitive' } },
                        { lastName: { contains: search, mode: 'insensitive' } },
                        { phone: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } }
                    ]
                },
                include: {
                    appointments: {
                        select: {
                            medical: {
                                select: { createdAt: true, treatmentPlan: true },
                                orderBy: { createdAt: 'desc' },
                                take: 1
                            }
                        },
                        orderBy: { appointmentDate: 'desc' },
                        take: 1
                    }
                },
                skip: SKIP,
                take: LIMIT,
                orderBy: { firstName: 'asc' }
            }),
            db.patient.count()
        ]);

        const totalPages = Math.ceil(totalRecords / LIMIT);

        return {
            success: true,
            data: patients,
            totalRecords,
            totalPages,
            currentPage: PAGE_NUMBER,
            status: 200
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal Server Error', status: 500 };
    }
}
