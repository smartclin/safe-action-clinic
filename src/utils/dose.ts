import db from '@/lib/db';

interface DoseGuideline {
    minDose?: number | null;
    maxDose?: number | null;
    minDosePerKg?: number | null;
    maxDosePerKg?: number | null;
    doseUnit?: string | null;
}

interface PrescriptionItem {
    drugId: string;
    dosageValue: number;
    dosageUnit: string;
}

export async function validateDoseAgainstGuidelines(
    item: PrescriptionItem,
    guidelines: DoseGuideline[],
    patientId: string
) {
    if (!guidelines.length) return;

    const guideline = guidelines.find(g => g.doseUnit === item.dosageUnit);
    if (!guideline) return;

    // Load patient weight (latest)
    const vitals = await db.vitalSigns.findFirst({
        where: { patientId, weight: { not: null } },
        orderBy: { recordedAt: 'desc' },
        select: { weight: true }
    });

    const weightKg = vitals?.weight ?? null;

    // --- Fixed dose validation ---
    if (
        (guideline.minDose != null && item.dosageValue < guideline.minDose) ||
        (guideline.maxDose != null && item.dosageValue > guideline.maxDose)
    ) {
        throw new Error(`Dose ${item.dosageValue}${item.dosageUnit} is outside recommended fixed range`);
    }

    // --- Weight-based validation (mg/kg) ---
    if (weightKg != null) {
        const dosePerKg = item.dosageValue / weightKg;

        if (
            (guideline.minDosePerKg != null && dosePerKg < guideline.minDosePerKg) ||
            (guideline.maxDosePerKg != null && dosePerKg > guideline.maxDosePerKg)
        ) {
            throw new Error(`Dose equals ${dosePerKg.toFixed(2)}${item.dosageUnit}/kg, outside safe pediatric range`);
        }
    }
}
