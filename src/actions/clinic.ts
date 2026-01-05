'use server';

import { revalidateTag } from 'next/cache';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';
import { checkRole } from '@/utils/roles';

// Create safe action client with metadata schema
const clinicClient = createSafeActionClient({
    defineMetadataSchema: () =>
        z.object({
            role: z.string().optional()
        })
});

// Add user to clinic
export const addUserToClinic = clinicClient
    .metadata({ role: 'ADMIN' })
    .inputSchema(
        z.object({
            userId: z.string(),
            clinicId: z.string(),
            role: z.enum(['ADMIN', 'STAFF', 'DOCTOR', 'PATIENT'])
        })
    )
    .action(async ({ parsedInput }) => {
        const session = await getSession();
        if (!session?.user) throw new Error('Unauthorized');

        const isAdmin = await checkRole('admin');
        if (!isAdmin) throw new Error('Insufficient permissions');

        const clinicMember = await db.clinicMember.create({
            data: {
                userId: parsedInput.userId,
                clinicId: parsedInput.clinicId,
                role: parsedInput.role,
                createdAt: new Date()
            }
        });

        revalidateTag(`clinic-${parsedInput.clinicId}-members`, 'max');
        revalidateTag(`user-${parsedInput.userId}-clinics`, 'max');

        return {
            success: true,
            data: { clinicMemberId: clinicMember.userId }
        };
    });

// Update clinic settings
export const updateClinicSettings = clinicClient
    .metadata({ role: 'ADMIN' })
    .inputSchema(
        z.object({
            clinicId: z.string(),
            openingTime: z.string(),
            closingTime: z.string(),
            workingDays: z.array(z.string()),
            defaultAppointmentDuration: z.number().min(15).max(120),
            requireEmergencyContact: z.boolean().default(true)
        })
    )
    .action(async ({ parsedInput }) => {
        const settings = await db.clinicSetting.upsert({
            where: { clinicId: parsedInput.clinicId },
            create: {
                ...parsedInput
            },
            update: parsedInput
        });

        revalidateTag(`clinic-${parsedInput.clinicId}-settings`, 'max');

        return {
            success: true,
            data: settings
        };
    });
