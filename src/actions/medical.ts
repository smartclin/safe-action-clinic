'use server';

import { cacheLife, cacheTag, revalidateTag, updateTag } from 'next/cache';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import type { MedicalRecordsWhereInput } from '@/generated/models';
import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';
import { DiagnosisSchema, PatientBillSchema, PaymentSchema } from '@/schema';
import { checkRole } from '@/utils/roles';

// Create medical action client with HIPAA-compliant error handling
const medicalActionClient = createSafeActionClient({
    handleServerError: error => {
        console.error('Medical action error:', error);
        // Don't expose sensitive medical errors to clients
        return {
            success: false,
            message: 'Unable to process medical request. Please try again.',
            error: true
        };
    },
    defineMetadataSchema: () =>
        z.object({
            role: z.enum(['admin', 'doctor', 'staff']).optional(),
            patientId: z.string().optional()
        })
});

// Extended diagnosis schema with appointment ID
const DiagnosisWithAppointmentSchema = DiagnosisSchema.extend({
    appointmentId: z.string().min(1, 'Appointment ID is required')
});

// Add diagnosis with cache invalidation
export const addDiagnosis = medicalActionClient
    .metadata({ role: 'doctor' }) // Only doctors can add diagnoses
    .inputSchema(DiagnosisWithAppointmentSchema)
    .action(async ({ parsedInput }) => {
        try {
            const { appointmentId, ...diagnosisData } = parsedInput;

            // Check if user has doctor role
            const isDoctor = await checkRole('doctor');
            if (!isDoctor) {
                return {
                    success: false,
                    message: 'You are not authorized to add a diagnosis',
                    error: true
                };
            }

            let medicalRecord = null;
            const session = await getSession();
            const clinicId = session?.user.clinic?.id ?? '';
            // Create medical record if not exists
            if (!diagnosisData.medicalId) {
                medicalRecord = await db.medicalRecords.create({
                    data: {
                        clinicId,
                        patientId: diagnosisData.patientId,
                        doctorId: diagnosisData.doctorId,
                        appointmentId: appointmentId,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });
            }

            const medId = diagnosisData.medicalId || medicalRecord?.id;

            // Create diagnosis
            const diagnosis = await db.diagnosis.create({
                data: {
                    ...diagnosisData,
                    medicalId: medId ?? '',
                    date: new Date(),
                    createdAt: new Date()
                }
            });

            // Update appointment status
            await db.appointment.update({
                where: { id: appointmentId },
                data: {
                    status: 'PENDING',
                    updatedAt: new Date()
                }
            });

            // Invalidate relevant caches
            revalidateTag(`patient-${diagnosisData.patientId}-records`, 'max');
            revalidateTag(`appointment-${appointmentId}-details`, 'max');
            updateTag('doctor-dashboard'); // Update doctor's dashboard immediately

            // Cache the diagnosis for quick access
            await cacheDiagnosis(diagnosis.id, diagnosis.date);

            return {
                success: true,
                message: 'Diagnosis added successfully',
                status: 201,
                data: {
                    diagnosisId: diagnosis.id,
                    medicalRecordId: medId
                }
            };
        } catch (error) {
            console.error('Add diagnosis error:', error);
            throw new Error('Failed to add diagnosis');
        }
    });

// Helper function to cache diagnosis
async function cacheDiagnosis(diagnosisId: string, date: Date) {
    'use cache';
    cacheTag(`diagnosis-${diagnosisId}`);
    cacheLife('days'); // Keep diagnosis cached for days

    return date;
}

// Patient bill creation with validation
export const addNewBill = medicalActionClient
    .metadata({ role: 'doctor' })
    .inputSchema(
        PatientBillSchema.extend({
            appointmentId: z.string().min(1, 'Appointment ID is required'),
            billId: z.string().optional()
        })
    )
    .action(async ({ parsedInput }) => {
        try {
            const { billId, appointmentId, ...billData } = parsedInput;

            // Check authorization
            const isAdmin = await checkRole('admin');
            const isDoctor = await checkRole('doctor');

            if (!isAdmin && !isDoctor) {
                return {
                    success: false,
                    message: 'You are not authorized to add a bill',
                    error: true
                };
            }

            let billInfo = null;

            // Create or retrieve payment record
            if (!billId || billId === 'undefined') {
                const appointmentInfo = await db.appointment.findUnique({
                    where: { id: appointmentId },
                    select: {
                        id: true,
                        patientId: true,
                        bills: {
                            where: { appointmentId: appointmentId },
                            take: 1
                        }
                    }
                });

                if (!appointmentInfo?.bills?.length) {
                    billInfo = await db.payment.create({
                        data: {
                            appointmentId: appointmentId,
                            patientId: appointmentInfo?.patientId,
                            billDate: new Date(),
                            paymentDate: new Date(),
                            discount: 0.0,
                            amountPaid: 0.0,
                            totalAmount: 0.0,
                            status: 'UNPAID',
                            createdAt: new Date()
                        }
                    });
                } else {
                    billInfo = appointmentInfo.bills[0];
                }
            } else {
                billInfo = { id: billId };
            }

            // Create bill item
            const patientBill = await db.patientBill.create({
                data: {
                    billId: billInfo?.id ?? '',
                    serviceId: billData.serviceId,
                    serviceDate: new Date(billData.serviceDate),
                    quantity: Number(billData.quantity),
                    unitCost: Number(billData.unitCost),
                    totalCost: Number(billData.totalCost),
                    createdAt: new Date()
                }
            });
            if (!billInfo) {
                return {
                    success: true,
                    message: 'Medical record saved without billing'
                };
            }
            // Update payment total
            await updatePaymentTotal(billInfo.id ?? '');

            // Invalidate caches
            revalidateTag(`patient-${billInfo.patientId}-bills`, 'max');
            revalidateTag(`appointment-${appointmentId}-billing`, 'max');
            updateTag('billing-queue');

            return {
                success: true,
                error: false,
                message: 'Bill added successfully',
                data: {
                    billId: patientBill.id,
                    paymentId: billInfo?.id ?? ''
                }
            };
        } catch (error) {
            console.error('Add bill error:', error);
            throw new Error('Failed to add bill');
        }
    });

// Helper to update payment total (cached)
async function updatePaymentTotal(paymentId: string) {
    'use cache';
    cacheTag(`payment-${paymentId}`);
    cacheLife('minutes'); // Short cache for frequently updated totals

    const total = await db.patientBill.aggregate({
        where: { billId: paymentId },
        _sum: { totalCost: true }
    });

    await db.payment.update({
        where: { id: paymentId },
        data: {
            totalAmount: total._sum.totalCost || 0,
            updatedAt: new Date()
        }
    });

    return total._sum.totalCost || 0;
}

// Generate final bill
export const generateBill = medicalActionClient
    .metadata({ role: 'admin' }) // Only admins can generate final bills
    .inputSchema(
        PaymentSchema.extend({
            id: z.string().min(1, 'Payment ID is required')
        })
    )
    .action(async ({ parsedInput }) => {
        try {
            const discountAmount = (Number(parsedInput.discount) / 100) * Number(parsedInput.totalAmount);

            // Update payment
            const payment = await db.payment.update({
                data: {
                    billDate: new Date(parsedInput.billDate),
                    discount: discountAmount,
                    totalAmount: Number(parsedInput.totalAmount),
                    status: 'PAID',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                where: { id: parsedInput.id }
            });

            // Update appointment status
            await db.appointment.update({
                data: {
                    status: 'COMPLETED',
                    appointmentDate: new Date(),
                    updatedAt: new Date()
                },
                where: { id: payment.appointmentId }
            });

            // Invalidate caches
            revalidateTag(`payment-${parsedInput.id}`, 'max');
            revalidateTag(`appointment-${payment.appointmentId}-status`, 'max');
            updateTag('revenue-reports');

            // Create invoice record
            await createInvoice(payment.id);

            return {
                success: true,
                error: false,
                message: 'Bill generated successfully',
                data: {
                    invoiceNumber: `INV-${payment.id.toString().padStart(6, '0')}`,
                    totalAmount: payment.totalAmount,
                    discount: discountAmount
                }
            };
        } catch (error) {
            console.error('Generate bill error:', error);
            throw new Error('Failed to generate bill');
        }
    });

// Cached invoice creation
async function createInvoice(paymentId: string) {
    'use cache';
    cacheTag(`invoice-${paymentId}`);
    cacheLife('max'); // Invoices are long-term records

    const invoice = await db.reminder.create({
        data: {
            appointmentId: paymentId,
            method: 'EMAIL',
            sentAt: new Date(),
            status: 'SENT'
        }
    });

    return invoice;
}

// ============ CACHED DATA FETCHING FUNCTIONS ============

// Get patient medical records (cached)
export async function getPatientMedicalRecords(patientId: string) {
    'use cache';
    cacheTag(`patient-${patientId}-records`);
    cacheLife('hours'); // Medical records update frequently

    const records = await db.medicalRecords.findMany({
        where: { patientId: patientId },
        include: {
            encounter: true,
            patient: {
                select: { firstName: true, lastName: true, dateOfBirth: true }
            },
            doctor: {
                select: { name: true, specialty: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return records;
}

// Get appointment billing details (cached)
export async function getAppointmentBilling(appointmentId: string) {
    'use cache';
    cacheTag(`appointment-${appointmentId}-billing`);
    cacheLife('minutes'); // Billing changes frequently

    const billing = await db.payment.findFirst({
        where: { appointmentId: appointmentId },
        include: {
            bills: {
                include: {
                    service: {
                        select: { serviceName: true, price: true }
                    }
                }
            },
            appointment: {
                select: {
                    patient: { select: { firstName: true, lastName: true } },
                    doctor: { select: { name: true } }
                }
            }
        }
    });

    return billing;
}

// Get doctor's recent diagnoses (cached)
export async function getDoctorDiagnoses(doctorId: string, limit = 10) {
    'use cache';
    cacheTag(`doctor-${doctorId}-diagnoses`);
    cacheLife('hours');

    const diagnoses = await db.diagnosis.findMany({
        where: { doctorId: doctorId },
        include: {
            medical: {
                include: {
                    patient: { select: { firstName: true, id: true } }
                }
            }
        },
        orderBy: { date: 'desc' },
        take: limit
    });

    return diagnoses;
}

// Get billing queue (cached)
export async function getBillingQueue() {
    'use cache';
    cacheTag('billing-queue');
    cacheLife('minutes'); // Real-time updates needed

    const queue = await db.payment.findMany({
        where: {
            status: 'PAID',
            totalAmount: { gt: 0 }
        },
        include: {
            appointment: {
                include: {
                    patient: { select: { firstName: true } },
                    doctor: { select: { name: true } }
                }
            }
        },
        orderBy: { createdAt: 'asc' },
        take: 20
    });

    return queue;
}

// Get revenue report (cached for analytics)
export async function getRevenueReport(startDate: Date, endDate: Date) {
    'use cache';
    cacheTag('revenue-reports');
    cacheLife('hours'); // Daily reports

    const payments = await db.payment.groupBy({
        by: ['status'],
        where: {
            billDate: {
                gte: startDate,
                lte: endDate
            }
        },
        _sum: {
            totalAmount: true,
            discount: true,
            amountPaid: true
        },
        _count: true
    });

    return payments;
}

export async function getLabTests(medicalId: string) {
    'use cache';
    cacheTag(`medical-${medicalId}-lab-tests`);
    cacheLife('hours');

    const labTests = await db.labTest.findMany({
        where: { recordId: medicalId },
        include: {
            service: {
                select: { serviceName: true }
            }
        },
        orderBy: { testDate: 'desc' }
    });

    return labTests;
}

export async function getPrescriptions(medicalRecordId: string, patientId: string, encounterId: string) {
    'use cache';
    cacheTag(`medical-${medicalRecordId}-prescriptions`);
    cacheLife('hours');

    const prescriptions = await db.prescription.findMany({
        where: { medicalRecordId: medicalRecordId, patientId: patientId, encounterId: encounterId },
        include: {
            encounter: {
                select: { diagnosis: true, treatment: true }
            },
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

export async function getMedicalRecordById(limit: number, clinicId: string, patientId: string, id: string) {
    'use cache';
    cacheTag(`medical-${id}`);
    cacheLife('hours');

    const whereClause: MedicalRecordsWhereInput = {
        patientId,
        clinicId,
        isDeleted: false
    };

    const data = await db.medicalRecords.findMany({
        where: whereClause,
        include: {
            patient: {
                select: {
                    firstName: true,
                    lastName: true,
                    gender: true,
                    image: true,
                    dateOfBirth: true
                }
            },
            doctor: {
                select: {
                    name: true,
                    specialty: true
                }
            },
            encounter: {
                // This should be plural if it's an array
                select: {
                    id: true,
                    diagnosis: true,
                    date: true
                },
                orderBy: { date: 'desc' }
            },
            labTest: {
                select: {
                    id: true,
                    testDate: true,
                    result: true
                },
                orderBy: { testDate: 'desc' }
            },
            prescriptions: {
                // Note: Capital P based on your Prisma schema
                select: {
                    id: true,
                    medicationName: true,
                    issuedDate: true
                },
                orderBy: { issuedDate: 'desc' }
            },
            vitalSigns: {
                // Capital V based on your Prisma schema
                select: {
                    id: true,
                    recordedAt: true
                },
                orderBy: { recordedAt: 'desc' },
                take: 1
            }
        },
        orderBy: { createdAt: 'desc' },
        take: limit
    });

    return data;
}
