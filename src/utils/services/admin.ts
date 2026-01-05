import db from '@/lib/db';

import { daysOfWeek } from '..';
import { processAppointments } from './patient';

export async function getAdminDashboardStats() {
    'use cache';
    const todayDate = new Date().getDay();
    const today = daysOfWeek[todayDate];

    const [totalPatient, totalDoctors, appointments, doctors] = await Promise.all([
        db.patient.count(),
        db.doctor.count(),
        db.appointment.findMany({
            include: {
                patient: {
                    select: {
                        id: true,
                        lastName: true,
                        firstName: true,
                        image: true,
                        colorCode: true,
                        gender: true,
                        dateOfBirth: true
                    }
                },
                doctor: {
                    select: {
                        name: true,
                        img: true,
                        colorCode: true,
                        specialty: true
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
                colorCode: true
            },
            take: 5
        })
    ]);

    const { appointmentCounts, monthlyData } = await processAppointments(appointments);

    const last5Records = appointments.slice(0, 5);

    return {
        success: true,
        totalPatient,
        totalDoctors,
        appointmentCounts,
        availableDoctors: doctors,
        monthlyData,
        last5Records,
        totalAppointments: appointments.length,
        status: 200
    };
}

export async function getClinics() {
    'use cache';
    const data = await db.clinic.findMany({
        orderBy: { name: 'asc' }
    });

    if (!data) {
        return {
            success: false,
            message: 'Data not found',
            status: 404,
            data: []
        };
    }

    return {
        success: true,
        data
    };
}

export async function getServices() {
    'use cache';
    const data = await db.service.findMany({
        orderBy: { serviceName: 'asc' }
    });

    if (!data) {
        return {
            success: false,
            message: 'Data not found',
            status: 404,
            data: []
        };
    }

    return {
        success: true,
        data
    };
}

// biome-ignore lint/suspicious/noExplicitAny: Necessary for Prisma update compatibility
export async function editService(id: string, data: any) {
    try {
        const service = await db.service.update({
            where: { id },
            data
        });
        return {
            success: true,
            data: service,
            message: 'Service updated successfully'
        };
    } catch (error) {
        console.error('Failed to edit service:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update service'
        };
    }
}

export async function deleteService(id: string) {
    try {
        const service = await db.service.delete({
            where: { id }
        });
        return {
            success: true,
            data: service,
            message: 'Service deleted successfully'
        };
    } catch (error) {
        console.error('Failed to delete service:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Failed to delete service'
        };
    }
}
