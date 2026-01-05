// actions/notifications.ts
'use server';

import { cacheTag, revalidateTag } from 'next/cache';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import db from '@/lib/db';
import { sendEmailNotification, sendSMSNotification } from '@/utils/notifications';

const notificationClient = createSafeActionClient();

// Create appointment reminder
export const createAppointmentReminder = notificationClient
    .inputSchema(
        z.object({
            appointmentId: z.string(),
            method: z.enum(['EMAIL', 'SMS']),
            sendAt: z.coerce.date(),
            message: z.string().optional()
        })
    )
    .action(async ({ parsedInput }) => {
        const appointment = await db.appointment.findUnique({
            where: { id: parsedInput.appointmentId },
            include: {
                patient: {
                    include: {
                        user: {
                            select: { email: true }
                        }
                    }
                }
            }
        });

        if (!appointment) throw new Error('Appointment not found');

        const reminder = await db.reminder.create({
            data: {
                appointmentId: parsedInput.appointmentId,
                method: parsedInput.method,
                sentAt: parsedInput.sendAt,
                status: 'PENDING'
            }
        });

        // Schedule notification
        const message =
            parsedInput.message ||
            `Reminder: Appointment with Dr. ${appointment.doctorId} on ${appointment.appointmentDate}`;

        if (parsedInput.method === 'EMAIL' && appointment.patient?.user?.email) {
            await sendEmailNotification({
                to: appointment.patient.user.email,
                subject: 'Appointment Reminder',
                message
            });
        } else if (parsedInput.method === 'SMS' && appointment.patient?.phone) {
            await sendSMSNotification({
                to: appointment.patient.phone,
                message
            });
        }

        await db.reminder.update({
            where: { id: reminder.id },
            data: { status: 'SENT' }
        });

        revalidateTag(`appointment-${parsedInput.appointmentId}-reminders`, 'max');

        return { success: true, data: { reminderId: reminder.id } };
    });

// Get user notifications
export async function getUserNotifications(userId: string, unreadOnly = false) {
    'use cache';
    cacheTag(`user-${userId}-notifications`);

    const notifications = await db.notification.findMany({
        where: {
            userId,
            ...(unreadOnly && { read: false })
        },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return notifications;
}
