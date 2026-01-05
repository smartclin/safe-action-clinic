'use server';

import { cacheLife, revalidateTag, updateTag } from 'next/cache';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import type { AppointmentWhereInput } from '@/generated/models';
import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';
import { AppointmentCreateSchema, VitalSignsSchema } from '@/schema';

// Define appointment status enum for TypeScript
const AppointmentStatus = z.enum(['SCHEDULED', 'PENDING', 'COMPLETED', 'CANCELLED', 'NO_SHOW']);

// Create safe action client for appointment actions
const appointmentClient = createSafeActionClient({
    handleServerError: error => {
        console.error('Appointment action error:', error);
        return {
            success: false,
            message: 'An error occurred while processing your appointment.',
            error: true
        };
    }
});

// Extended appointment schema with proper types

// Create new appointment with cache invalidation
export const createNewAppointment = appointmentClient
    .inputSchema(AppointmentCreateSchema)
    .action(async ({ parsedInput }) => {
        try {
            const session = await getSession();
            if (!session?.user) {
                throw new Error('Unauthorized');
            }

            const appointment = await db.appointment.create({
                data: {
                    patientId: parsedInput.patientId,
                    doctorId: parsedInput.doctorId,
                    time: parsedInput.time,
                    type: parsedInput.type,
                    appointmentDate: new Date(parsedInput.appointmentDate),
                    note: parsedInput.note || null,
                    status: 'SCHEDULED'
                }
            });

            // Invalidate relevant caches
            revalidateTag(`patient-${parsedInput.patientId}-appointments`, 'max');
            revalidateTag(`doctor-${parsedInput.doctorId}-schedule`, 'max');
            revalidateTag('appointments-today', 'max');
            updateTag('dashboard-stats'); // Immediate update for dashboard

            return {
                success: true,
                message: 'Appointment booked successfully',
                data: {
                    id: appointment.id,
                    appointmentDate: appointment.appointmentDate,
                    status: appointment.status
                }
            };
        } catch (error) {
            console.error('Create appointment error:', error);
            throw new Error('Failed to create appointment');
        }
    });

// Appointment status update action
const AppointmentUpdateSchema = z.object({
    id: z.uuid(),
    status: AppointmentStatus,
    reason: z.string().min(1, 'Reason is required').max(500)
});

export const appointmentAction = appointmentClient
    .inputSchema(AppointmentUpdateSchema)
    .action(async ({ parsedInput }) => {
        try {
            const session = await getSession();
            if (!session?.user) {
                throw new Error('Unauthorized');
            }

            const appointment = await db.appointment.update({
                where: { id: parsedInput.id },
                data: {
                    status: parsedInput.status,
                    reason: parsedInput.reason,
                    updatedAt: new Date()
                },
                include: {
                    patient: { select: { id: true } },
                    doctor: { select: { id: true } }
                }
            });

            // Update caches based on status change
            revalidateTag(`patient-${appointment.patient?.id}-appointments`, 'max');
            revalidateTag(`doctor-${appointment.doctor.id}-schedule`, 'max');

            if (parsedInput.status === 'CANCELLED' || parsedInput.status === 'COMPLETED') {
                updateTag('available-slots'); // Immediate update for slot availability
                revalidateTag('appointments-today', 'max');
            }

            return {
                success: true,
                error: false,
                message: `Appointment ${parsedInput.status.toLowerCase()} successfully`,
                data: {
                    id: appointment.id,
                    status: appointment.status,
                    patientId: appointment.patient?.id,
                    doctorId: appointment.doctor.id
                }
            };
        } catch (error) {
            console.error('Appointment action error:', error);
            throw new Error('Failed to update appointment');
        }
    });
export type VitalSignsFormData = z.infer<typeof VitalSignsSchema>;
// Vital signs action with medical record creation
const VitalSignsWithContextSchema = VitalSignsSchema.extend({
    appointmentId: z.string().min(1, 'Appointment ID is required'),
    doctorId: z.string().min(1, 'Doctor ID is required')
});

export const addVitalSigns = appointmentClient
    .inputSchema(VitalSignsWithContextSchema)
    .action(async ({ parsedInput }) => {
        try {
            const session = await getSession();
            if (!session?.user) {
                throw new Error('Unauthorized');
            }
            const clinicId = session.user.clinic?.id ?? '';
            const { appointmentId, doctorId, medicalId, patientId, ...vitalSignsData } = parsedInput;

            let medicalRecordId = medicalId;

            // Create medical record if not exists
            if (!medicalRecordId) {
                const medicalRecord = await db.medicalRecords.create({
                    data: {
                        clinicId,
                        patientId,
                        appointmentId: appointmentId,
                        doctorId: doctorId
                    }
                });
                medicalRecordId = medicalRecord.id;
            }

            // Create vital signs entry
            const vitalSigns = await db.vitalSigns.create({
                data: {
                    ...vitalSignsData,
                    patientId,
                    medicalId: medicalRecordId,
                    recordedAt: new Date()
                }
            });

            // Update appointment status if vital signs are added
            await db.appointment.update({
                where: { id: appointmentId },
                data: { status: 'PENDING' }
            });

            // Invalidate caches
            revalidateTag(`patient-${patientId}-medical-records`, 'max');
            revalidateTag(`appointment-${appointmentId}-details`, 'max');
            updateTag('patient-stats');

            return {
                success: true,
                message: 'Vital signs added successfully',
                data: {
                    id: vitalSigns.id,
                    medicalRecordId: medicalRecordId
                }
            };
        } catch (error) {
            console.error('Add vital signs error:', error);
            throw new Error('Failed to add vital signs');
        }
    });

// ==================== CACHED QUERIES ====================

// Get appointments for a specific patient (cached for 30 minutes)
export async function getPatientAppointments(patientId: string) {
    'use cache';

    const appointments = await db.appointment.findMany({
        where: {
            patientId: patientId,
            appointmentDate: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) } // Last 30 days
        },
        include: {
            doctor: {
                select: {
                    name: true,
                    specialty: true,
                    user: { select: { email: true } }
                }
            },
            encounters: {
                take: 1,
                orderBy: { createdAt: 'desc' }
            }
        },
        orderBy: { appointmentDate: 'desc' }
    });

    return appointments;
}

// Get today's appointments for dashboard (cached for 5 minutes)
export async function getTodaysAppointments(doctorId?: string) {
    'use cache';
    cacheLife('minutes');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const whereClause: AppointmentWhereInput = {
        appointmentDate: {
            gte: today,
            lt: tomorrow
        },
        status: { in: ['SCHEDULED', 'PENDING', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] }
    };

    if (doctorId) {
        Object.assign(whereClause, { doctorId: doctorId });
    }

    const appointments = await db.appointment.findMany({
        where: whereClause,
        include: {
            patient: {
                select: {
                    firstName: true,
                    dateOfBirth: true,
                    user: { select: { email: true } }
                }
            },
            doctor: {
                select: { name: true }
            }
        },
        orderBy: { time: 'asc' }
    });

    return appointments;
}

// Get doctor's schedule (cached for 1 hour)
export async function getDoctorSchedule(doctorId: string, date?: string) {
    'use cache';
    cacheLife('hours');

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const [appointments, workingDays] = await Promise.all([
        db.appointment.findMany({
            where: {
                doctorId: doctorId,
                appointmentDate: {
                    gte: targetDate,
                    lt: nextDay
                },
                status: { in: ['SCHEDULED', 'PENDING'] }
            },
            orderBy: { time: 'asc' }
        }),
        db.workingDays.findMany({
            where: { doctorId: doctorId }
        })
    ]);

    return {
        appointments,
        workingHours: workingDays.find(
            w => w.day === targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        ),
        date: targetDate.toISOString().split('T')[0]
    };
}

// Get appointment details with full context (cached for patient view)
export async function getAppointmentDetails(appointmentId: string) {
    'use cache';

    const appointment = await db.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            patient: {
                include: {
                    user: { select: { email: true } },
                    medicalRecords: {
                        include: {
                            vitalSigns: {
                                orderBy: { recordedAt: 'desc' },
                                take: 10
                            }
                        },
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    }
                }
            },
            doctor: {
                include: {
                    user: { select: { email: true } },
                    workingDays: true
                }
            },
            encounters: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    return appointment;
}

// Get available appointment slots for a doctor (cached, frequently updated)
export async function getAvailableSlots(doctorId: string, date: string) {
    'use cache';
    cacheLife('minutes'); // Short cache for real-time availability

    const targetDate = new Date(date);
    const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const [workingDay, bookedAppointments] = await Promise.all([
        db.workingDays.findFirst({
            where: {
                doctorId: doctorId,
                day: dayName
            }
        }),
        db.appointment.findMany({
            where: {
                doctorId: doctorId,
                appointmentDate: targetDate,
                status: { in: ['SCHEDULED', 'PENDING'] }
            },
            select: { time: true }
        })
    ]);

    if (!workingDay) {
        return { available: false, slots: [] };
    }

    // Generate time slots based on working hours
    const bookedTimes = bookedAppointments.map(a => a.time).filter((time): time is string => time !== null);

    const slots = generateTimeSlots(workingDay.startTime, workingDay.closeTime, 30, bookedTimes);

    return {
        available: true,
        slots,
        doctorId,
        date: targetDate.toISOString().split('T')[0]
    };
}

function parseTime(time: string): { hour: number; minute: number } {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);

    if (!match) {
        throw new Error(`Invalid time format: ${time}`);
    }

    return {
        hour: Number(match[1]),
        minute: Number(match[2])
    };
}

// Helper function to generate time slots
function generateTimeSlots(
    startTime: string,
    endTime: string,
    intervalMinutes: number,
    bookedTimes: string[]
): string[] {
    const slots: string[] = [];

    const { hour: startHour, minute: startMinute } = parseTime(startTime);
    const { hour: endHour, minute: endMinute } = parseTime(endTime);

    let currentHour = startHour;
    let currentMinute = startMinute;

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

        if (!bookedTimes.includes(timeString)) {
            slots.push(timeString);
        }

        currentMinute += intervalMinutes;

        if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
            currentMinute %= 60;
        }
    }

    return slots;
}

// Dashboard statistics (cached with frequent updates)
export async function getAppointmentStats(timeframe: 'today' | 'week' | 'month' = 'today') {
    'use cache';

    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'week':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
            break;
        case 'month':
            startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 1);
            break;
    }

    const [total, byStatus, recent] = await Promise.all([
        db.appointment.count({
            where: { appointmentDate: { gte: startDate } }
        }),
        db.appointment.groupBy({
            by: ['status'],
            where: { appointmentDate: { gte: startDate } },
            _count: true
        }),
        db.appointment.findMany({
            where: { appointmentDate: { gte: startDate } },
            include: {
                patient: { select: { firstName: true, lastName: true } },
                doctor: { select: { name: true } }
            },
            orderBy: { appointmentDate: 'desc' },
            take: 10
        })
    ]);

    return {
        total,
        byStatus: Object.fromEntries(byStatus.map(item => [item.status, item._count])),
        recent,
        timeframe
    };
}
