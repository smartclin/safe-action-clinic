// actions/immunization.ts
'use server';

import { cacheLife, cacheTag, revalidateTag, updateTag } from 'next/cache';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';

const immunizationClient = createSafeActionClient({
    handleServerError: () => ({
        success: false,
        message: 'Failed to process immunization request',
        error: true
    })
});

// Record immunization
export const recordImmunization = immunizationClient
    .inputSchema(
        z.object({
            patientId: z.string(),
            vaccine: z.string(),
            date: z.coerce.date(),
            dose: z.string().optional(),
            lotNumber: z.string().optional(),
            administeredByStaffId: z.string().optional(),
            notes: z.string().optional(),
            nextDueDate: z.coerce.date().optional()
        })
    )
    .action(async ({ parsedInput }) => {
        const session = await getSession();
        if (!session || !['ADMIN', 'DOCTOR', 'STAFF'].includes(session.user.role ?? '')) {
            throw new Error('Unauthorized');
        }

        const immunization = await db.immunization.create({
            data: {
                ...parsedInput,
                date: new Date(parsedInput.date)
            }
        });

        // Create reminder for next dose
        if (parsedInput.nextDueDate) {
            await db.notification.create({
                data: {
                    userId: session.user.id,
                    title: 'Immunization Due',
                    message: `Next dose of ${parsedInput.vaccine} is due`,
                    type: 'warning',
                    createdAt: new Date()
                }
            });
        }

        revalidateTag(`patient-${parsedInput.patientId}-immunizations`, 'max');
        revalidateTag('immunization-schedule', 'max');
        updateTag('patient-stats');

        return {
            success: true,
            data: { immunizationId: immunization.id }
        };
    });

// Get immunization schedule for patient
export async function getPatientImmunizationSchedule(patientId: string) {
    'use cache';
    cacheTag(`patient-${patientId}-immunizations`);
    cacheLife('days');

    const patient = await db.patient.findUnique({
        where: { id: patientId },
        select: { dateOfBirth: true }
    });

    const ageDays = patient?.dateOfBirth ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / 86_400_000) : 0;

    const [immunizations, schedule, dueVaccines] = await Promise.all([
        db.immunization.findMany({
            where: { patientId },
            orderBy: { date: 'desc' }
        }),
        db.vaccineSchedule.findMany({
            orderBy: { ageInDaysMin: 'asc' }
        }),
        db.vaccineSchedule.findMany({
            where: { ageInDaysMin: { lte: ageDays } }
        })
    ]);

    return { immunizations, schedule, dueVaccines, patientAgeDays: ageDays };
}
