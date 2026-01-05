// actions/growth.ts
'use server';

import { cacheTag, revalidateTag } from 'next/cache';
import { createSafeActionClient } from 'next-safe-action';

import db from '@/lib/db';
import { GrowthRecordSchema } from '@/schema';
import { checkGrowthAlerts, classifyGrowthStatus } from '@/utils/growth';

const growthClient = createSafeActionClient();

// Record growth measurements
export const recordGrowthMeasurement = growthClient.inputSchema(GrowthRecordSchema).action(async ({ parsedInput }) => {
    const whoData = await calculateWHOPercentiles(
        parsedInput?.weight ?? 0,
        parsedInput?.height ?? 0,
        parsedInput?.headCircumference ?? 0,
        parsedInput.gender,
        parsedInput.ageDays
    );

    const vitalSigns = await db.vitalSigns.create({
        data: {
            patientId: parsedInput.patientId,
            encounterId: parsedInput.encounterId,
            medicalId: parsedInput.medicalId,

            gender: parsedInput.gender,
            ageDays: parsedInput.ageDays,
            ageMonths: parsedInput.ageMonths,

            weight: parsedInput.weight,
            height: parsedInput.height,
            headCircumference: parsedInput.headCircumference,

            ...whoData,
            recordedAt: new Date()
        }
    });

    await checkGrowthAlerts(vitalSigns.id, whoData);

    revalidateTag(`patient-${parsedInput.patientId}-growth`, 'max');

    return {
        success: true,
        data: {
            recordId: vitalSigns.id,
            growth: whoData
        }
    };
});

// Get growth history
export async function getPatientGrowthHistory(patientId: string, limit = 20) {
    'use cache';
    cacheTag(`patient-${patientId}-growth`);

    const records = await db.vitalSigns.findMany({
        where: { patientId },
        orderBy: { recordedAt: 'desc' },
        take: limit,
        include: {
            encounter: {
                select: { doctor: { select: { name: true } } }
            }
        }
    });

    return records;
}

// Helper function for WHO calculations
async function calculateWHOPercentiles(
    weight: number,
    height: number,
    _headCircumference: number | undefined,
    gender: string,
    ageDays: number
) {
    const whoStandard = await db.wHOGrowthStandard.findFirst({
        where: {
            gender: gender as 'MALE' | 'FEMALE',
            ageDays: { lte: ageDays },
            measurementType: 'WFA'
        },
        orderBy: { ageDays: 'desc' }
    });

    if (!whoStandard) {
        return {
            weightForAgeZ: null,
            heightForAgeZ: null,
            hcForAgeZ: null,
            growthStatus: 'NORMAL'
        };
    }

    // Calculate Z-scores (simplified)
    const weightZ = (Math.log(weight) - whoStandard.mValue) / whoStandard.sValue;
    const heightZ = height ? (height - whoStandard.mValue) / whoStandard.sValue : null;

    return {
        weightForAgeZ: weightZ,
        heightForAgeZ: heightZ,
        hcForAgeZ: null,
        growthStatus: classifyGrowthStatus(weightZ, heightZ)
    };
}
