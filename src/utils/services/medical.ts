import { format } from 'date-fns';

import type { DiagnosisWhereInput, VitalSignsWhereInput } from '@/generated/models';
import db from '@/lib/db';

export const getVitalSignData = async (id: string) => {
    'use cache';
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const data = await db.vitalSigns.findMany({
        where: {
            patientId: id,
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        select: {
            id: true,
            bodyTemperature: true,
            createdAt: true,
            systolic: true,
            diastolic: true,
            weight: true,
            respiratoryRate: true,
            oxygenSaturation: true,
            height: true,
            heartRate: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });
    // 56 - 60
    const formatVitals = data?.map(record => ({
        label: format(new Date(record.createdAt), 'MMM d'),
        id: record.id,
        createdAt: record.createdAt,
        respiratoryRate: record.respiratoryRate ?? 0,
        oxygenSaturation: record.oxygenSaturation ?? 0,
        bodyTemperature: record.bodyTemperature ?? 0,
        systolic: record.systolic ?? 0,
        heartRate: record.heartRate ?? 0,
        weight: record.weight ?? 0,
        height: record.height ?? 0,
        diastolic: record.diastolic ?? 0
    }));

    const formattedData = data.map(record => {
        const heartRates = record.heartRate?.split('-')?.map(rate => Number.parseInt(rate.trim(), 10)) ?? [0, 0];

        return {
            label: format(new Date(record.createdAt), 'MMM d'),
            value1: heartRates[0] ?? 0,
            value2: heartRates[1] ?? 0
        };
    });

    const totalSystolic = data?.reduce((sum, acc) => sum + (acc.systolic ?? 0), 0);
    const totalDiastolic = data?.reduce((sum, acc) => sum + (acc.diastolic ?? 0), 0);

    const totalValue1 = formattedData?.reduce((sum, acc) => sum + (acc.value1 ?? 0), 0);
    const totalValue2 = formattedData?.reduce((sum, acc) => sum + (acc.value2 ?? 0), 0);

    const count = data?.length;

    const averageSystolic = totalSystolic / count;
    const averageDiastolic = totalDiastolic / count;

    const averageValue1 = totalValue1 / count;
    const averageValue2 = totalValue2 / count;

    const average = `${averageSystolic.toFixed(2)}/${averageDiastolic.toFixed(2)} mg/dL`;
    const averageHeartRate = `${averageValue1.toFixed(2)}-${averageValue2.toFixed(2)} bpm`;

    return {
        data: formatVitals,
        average,
        heartRateData: formattedData,
        averageHeartRate
    };
};

interface GetVitalSignsOptions {
    patientId: string;
    medicalId?: string;
}

export async function getVitalSigns({ patientId, medicalId }: GetVitalSignsOptions) {
    'use cache';
    const where: VitalSignsWhereInput = { patientId };
    if (medicalId) where.medicalId = medicalId;

    return db.vitalSigns.findMany({
        where,
        orderBy: { recordedAt: 'desc' },
        take: 10
    });
}

interface GetDiagnosisOptions {
    patientId: string;
    medicalId?: string;
}

export async function getDiagnosis({ patientId, medicalId }: GetDiagnosisOptions) {
    'use cache';
    const where: DiagnosisWhereInput = { patientId };
    if (medicalId) where.medicalId = medicalId;

    return db.diagnosis.findMany({
        where,
        include: {
            doctor: {
                select: { name: true, specialty: true }
            }
        },
        orderBy: { date: 'desc' },
        take: 10
    });
}
