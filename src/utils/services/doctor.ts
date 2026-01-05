import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';

import { daysOfWeek } from '..';
import { processAppointments } from './patient';

export async function getDoctors() {
    'use cache';
    try {
        const data = await db.doctor.findMany();

        return { success: true, data, status: 200 };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal Server Error', status: 500 };
    }
}
export async function getDoctorDashboardStats() {
    'use cache';
    try {
        const session = await getSession();
        const userId = session?.user?.id;

        const todayDate = new Date().getDay();
        const today = daysOfWeek[todayDate];

        const [totalPatient, totalNurses, appointments, doctors] = await Promise.all([
            db.patient.count(),
            db.staff.count({ where: { role: 'STAFF' } }),
            db.appointment.findMany({
                where: { doctorId: userId, appointmentDate: { lte: new Date() } },
                include: {
                    patient: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            gender: true,
                            dateOfBirth: true,
                            colorCode: true,
                            image: true
                        }
                    },
                    doctor: {
                        select: {
                            id: true,
                            name: true,
                            specialty: true,
                            img: true,
                            colorCode: true
                        }
                    }
                },
                orderBy: { appointmentDate: 'desc' }
            }),
            db.doctor.findMany({
                where: {
                    workingDays: {
                        some: { day: { equals: today, mode: 'insensitive' } }
                    }
                },
                select: {
                    id: true,
                    name: true,
                    specialty: true,
                    img: true,
                    colorCode: true,
                    workingDays: true
                },
                take: 5
            })
        ]);

        const { appointmentCounts, monthlyData } = await processAppointments(appointments);

        const last5Records = appointments.slice(0, 5);
        // const availableDoctors = doctors.slice(0, 5);

        return {
            totalNurses,
            totalPatient,
            appointmentCounts,
            last5Records,
            availableDoctors: doctors,
            totalAppointment: appointments?.length,
            monthlyData
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getDoctorById(id: string) {
    'use cache';
    try {
        const [doctor, totalAppointment] = await Promise.all([
            db.doctor.findUnique({
                where: { id },
                include: {
                    workingDays: true,
                    appointments: {
                        include: {
                            patient: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    gender: true,
                                    image: true,
                                    colorCode: true
                                }
                            },
                            doctor: {
                                select: {
                                    name: true,
                                    specialty: true,
                                    img: true,
                                    colorCode: true
                                }
                            }
                        },
                        orderBy: { appointmentDate: 'desc' },
                        take: 10
                    }
                }
            }),
            db.appointment.count({
                where: { doctorId: id }
            })
        ]);

        return { data: doctor, totalAppointment };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal Server Error', status: 500 };
    }
}

export async function getRatingById(id: string) {
    'use cache';
    try {
        const data = await db.rating.findMany({
            where: { staffId: id },
            include: {
                patient: { select: { lastName: true, firstName: true } }
            }
        });

        const totalRatings = data?.length;
        const sumRatings = data?.reduce((sum, el) => sum + el.rating, 0);

        const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
        const formattedRatings = (Math.round(averageRating * 10) / 10).toFixed(1);

        return {
            totalRatings,
            averageRating: formattedRatings,
            ratings: data
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal Server Error', status: 500 };
    }
}

export async function getAllDoctors({
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

        const [doctors, totalRecords] = await Promise.all([
            db.doctor.findMany({
                where: {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { specialty: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } }
                    ]
                },
                include: { workingDays: true },
                skip: SKIP,
                take: LIMIT
            }),
            db.doctor.count()
        ]);

        const totalPages = Math.ceil(totalRecords / LIMIT);

        return {
            success: true,
            data: doctors,
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
