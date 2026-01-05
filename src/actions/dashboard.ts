// actions/dashboard.ts
'use server';

import { cacheLife, cacheTag } from 'next/cache';

import db from '@/lib/db';

// Get clinic dashboard data
export async function getClinicDashboard(clinicId: string) {
    'use cache';
    cacheTag(`clinic-${clinicId}-dashboard`);
    cacheLife('minutes');
    type PendingImmunizationRow = { count: bigint };
    const [totalPatients, totalAppointments, todayAppointments, revenue, pendingImmunizations, staffCount] =
        await Promise.all([
            db.patient.count({ where: { clinicId, isDeleted: false } }),
            db.appointment.count({ where: { clinicId } }),
            db.appointment.count({
                where: {
                    clinicId,
                    appointmentDate: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(23, 59, 59, 999))
                    }
                }
            }),
            db.payment.aggregate({
                where: { clinicId, status: 'PAID' },
                _sum: { totalAmount: true }
            }),
            // Calculate due immunizations
            db.$queryRaw<PendingImmunizationRow[]>`
  SELECT COUNT(*) as  count
  FROM vaccine_schedule vs
  CROSS JOIN patients p
  WHERE p.clinic_id = ${clinicId}
    AND p.is_deleted = false
    AND vs.age_in_days_min <= EXTRACT(DAY FROM AGE(NOW(), p.date_of_birth))
    AND NOT EXISTS (
      SELECT 1 FROM immunizations i
      WHERE i.patientId = p.id
      AND i.vaccine = vs.vaccineName
    )
`,
            db.staff.count({ where: { clinicId, status: 'ACTIVE' } })
        ]);

    return {
        totalPatients,
        totalAppointments,
        todayAppointments,
        revenue: revenue._sum.totalAmount || 0,
        pendingImmunizations: Number(pendingImmunizations[0]?.count ?? 0),
        staffCount
    };
}

// Get pediatric-specific stats
export async function getPediatricStats(clinicId: string) {
    'use cache';
    cacheTag(`clinic-${clinicId}-pediatric-stats`);

    const [ageDistribution, commonConditions, immunizationCoverage, growthMonitoring] = await Promise.all([
        // Age distribution
        db.$queryRaw`
      SELECT 
        CASE 
          WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) < 1 THEN 'Infants (<1)'
          WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 1 AND 5 THEN 'Toddlers (1-5)'
          WHEN EXTRACT(YEAR FROM AGE(NOW(), date_of_birth)) BETWEEN 6 AND 12 THEN 'Children (6-12)'
          ELSE 'Adolescents (13+)'
        END as age_group,
        COUNT(*) as count
      FROM patients
      WHERE clinic_id = ${clinicId} AND is_deleted = false
      GROUP BY age_group
    `,
        // Common conditions
        db.diagnosis.groupBy({
            by: ['diagnosis'],
            where: { clinicId },
            _count: {
                diagnosis: true
            },
            orderBy: {
                _count: {
                    diagnosis: 'desc'
                }
            },
            take: 10
        }),
        // Immunization coverage
        db.$queryRaw`
      SELECT 
        COUNT(DISTINCT p.id) as total_patients,
        COUNT(DISTINCT i.patient_id) as immunized_patients,
        ROUND(COUNT(DISTINCT i.patient_id) * 100.0 / COUNT(DISTINCT p.id), 2) as coverage_rate
      FROM patients p
      LEFT JOIN immunizations i ON p.id = i.patient_id
      WHERE p.clinic_id = ${clinicId} AND p.is_deleted = false
    `,
        // Growth monitoring compliance
        db.$queryRaw`
      SELECT 
        COUNT(DISTINCT p.id) as total_patients,
        COUNT(DISTINCT vs.patient_id) as monitored_patients,
        AVG(vs.weight) as avg_weight,
        AVG(vs.height) as avg_height
      FROM patients p
      LEFT JOIN vital_signs vs ON p.id = vs.patient_id
      WHERE p.clinic_id = ${clinicId} 
        AND p.is_deleted = false
        AND vs.recorded_at > NOW() - INTERVAL '1 year'
    `
    ]);

    return {
        ageDistribution,
        commonConditions,
        immunizationCoverage,
        growthMonitoring
    };
}
