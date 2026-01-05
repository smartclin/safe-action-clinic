import db from '@/lib/db';

export type GrowthStatus = 'NORMAL' | 'UNDERWEIGHT' | 'STUNTED' | 'WASTED' | 'OVERWEIGHT' | 'OBESE';

export function classifyGrowthStatus(
    weightZ?: number | null,
    heightZ?: number | null,
    bmiZ?: number | null
): GrowthStatus {
    if (bmiZ !== undefined && bmiZ !== null) {
        if (bmiZ > 3) return 'OBESE';
        if (bmiZ > 2) return 'OVERWEIGHT';
    }

    if (weightZ !== undefined && weightZ !== null && weightZ < -2) {
        return 'UNDERWEIGHT';
    }

    if (heightZ !== undefined && heightZ !== null && heightZ < -2) {
        return 'STUNTED';
    }

    return 'NORMAL';
}

export async function checkGrowthAlerts(
    vitalId: string,
    data: {
        weightForAgeZ?: number | null;
        heightForAgeZ?: number | null;
    }
) {
    if ((data.weightForAgeZ && data.weightForAgeZ < -3) || (data.heightForAgeZ && data.heightForAgeZ < -3)) {
        // Future: notify doctor / add alert table
        console.warn(`🚨 Severe growth deviation for vital ${vitalId}`);
    }
}

export function calculateZScore(x: number, l: number, m: number, s: number): number {
    if (l === 0) {
        return Math.log(x / m) / s;
    }
    return ((x / m) ** l - 1) / (l * s);
}

export async function calculateWHOPercentiles(
    weight: number | undefined,
    height: number | undefined,
    gender: 'MALE' | 'FEMALE',
    ageDays: number
) {
    const results: {
        weightForAgeZ?: number | null;
        heightForAgeZ?: number | null;
        hcForAgeZ?: number | null;
        growthStatus: string;
    } = {
        growthStatus: 'NORMAL'
    };

    if (weight) {
        const wfa = await db.wHOGrowthStandard.findFirst({
            where: {
                gender,
                ageDays,
                measurementType: 'WFA'
            }
        });

        if (wfa) {
            results.weightForAgeZ = calculateZScore(weight, wfa.lValue, wfa.mValue, wfa.sValue);
        }
    }

    if (height) {
        const hfa = await db.wHOGrowthStandard.findFirst({
            where: {
                gender,
                ageDays,
                measurementType: 'HFA'
            }
        });

        if (hfa) {
            results.heightForAgeZ = calculateZScore(height, hfa.lValue, hfa.mValue, hfa.sValue);
        }
    }

    results.growthStatus = classifyGrowthStatus(results.weightForAgeZ, results.heightForAgeZ);

    return results;
}
