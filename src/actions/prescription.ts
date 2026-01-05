// actions/prescription.ts
'use server';

import { cacheLife, cacheTag, revalidateTag, updateTag } from 'next/cache';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';
import { dosageUnitSchema } from '@/schema';
import { validateDoseAgainstGuidelines } from '@/utils/dose';

const prescriptionClient = createSafeActionClient({
    handleServerError: error => {
        console.error('Prescription error:', error);
        return {
            success: false,
            message: 'Failed to process prescription',
            error: true
        };
    }
});

// Create prescription with drug validation
export const createPrescription = prescriptionClient
    .inputSchema(
        z.object({
            medicalRecordId: z.uuid(),
            encounterId: z.string(),
            patientId: z.string(),
            doctorId: z.string(),
            items: z.array(
                z.object({
                    drugId: z.string(),
                    dosageValue: z.number().positive(),
                    dosageUnit: dosageUnitSchema,
                    frequency: z.string(),
                    duration: z.string(),
                    instructions: z.string().optional()
                })
            ),
            instructions: z.string().optional(),
            followUpDate: z.coerce.date().optional()
        })
    )
    .action(async ({ parsedInput }) => {
        const session = await getSession();
        if (!session?.user || session.user.role !== 'ADMIN') {
            throw new Error('Unauthorized');
        }

        // Validate drug doses against guidelines
        for (const item of parsedInput.items) {
            const guidelines = await db.doseGuideline.findMany({
                where: { drugId: item.drugId }
            });

            await validateDoseAgainstGuidelines(item, guidelines, parsedInput.patientId);
        }

        const prescription = await db.prescription.create({
            data: {
                encounterId: parsedInput.encounterId,
                patientId: parsedInput.patientId,
                doctorId: parsedInput.doctorId,
                medicalRecordId: parsedInput.medicalRecordId,
                issuedDate: new Date(),
                status: 'active',
                instructions: parsedInput.instructions,
                prescribedItems: {
                    create: parsedInput.items.map(item => ({
                        drug: { connect: { id: item.drugId } },
                        dosageValue: item.dosageValue,
                        dosageUnit: item.dosageUnit,
                        frequency: item.frequency,
                        duration: item.duration,
                        instructions: item.instructions
                    }))
                }
            }
        });

        // Update encounter
        await db.diagnosis.update({
            where: { id: parsedInput.encounterId },
            data: {
                followUpPlan: parsedInput.followUpDate
                    ? `Follow up on ${parsedInput.followUpDate.toDateString()}`
                    : null
            }
        });

        revalidateTag(`patient-${parsedInput.patientId}-prescriptions`, 'max');
        revalidateTag(`doctor-${parsedInput.doctorId}-prescriptions`, 'max');
        updateTag('pharmacy-queue');

        return {
            success: true,
            data: { prescriptionId: prescription.id }
        };
    });

// Get patient prescriptions
export async function getPatientPrescriptions(patientId: string, status?: string) {
    'use cache';
    cacheTag(`patient-${patientId}-prescriptions`);
    cacheLife('minutes');

    const prescriptions = await db.prescription.findMany({
        where: {
            patientId,
            ...(status && { status })
        },
        include: {
            prescribedItems: {
                include: {
                    drug: true
                }
            },
            doctor: {
                select: { name: true }
            }
        },
        orderBy: { issuedDate: 'desc' }
    });

    return prescriptions;
}
