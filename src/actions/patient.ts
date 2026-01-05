// actions/patient.ts
'use server';

import { cacheTag, revalidateTag, updateTag } from 'next/cache';
import { headers } from 'next/headers';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import type { PatientWhereInput } from '@/generated/models';
import { auth } from '@/lib/auth';
import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';
import { patientFormSchema } from '@/schema';

// Create safe action client for patient actions
const patientActionClient = createSafeActionClient({
    handleServerError: error => {
        console.error('Patient action error:', error);
        return {
            success: false,
            message: error.message || 'Failed to process patient request',
            error: true
        };
    },
    defineMetadataSchema: () =>
        z.object({
            patientId: z.string().optional(),
            requireAuth: z.boolean().default(true)
        })
});

// Extended patient schema for validation
const PatientUpdateSchema = patientFormSchema.extend({
    pid: z.string().min(1, 'Patient ID is required')
});

const PatientCreateSchema = patientFormSchema.extend({
    pid: z.string().optional().default('new-patient'),
    email: z.email('Valid email is required').optional(),
    clinicId: z.string().optional(),
    phone: z.string().min(1, 'Phone number is required').optional()
});

// Update patient with cache invalidation
export const updatePatient = patientActionClient
    .metadata({ requireAuth: true })
    .inputSchema(PatientUpdateSchema)
    .action(async ({ parsedInput }) => {
        try {
            // Check authentication if required
            const session = await getSession();
            if (!session?.user) {
                throw new Error('Unauthorized - Please login to update patient data');
            }

            const { pid, ...patientData } = parsedInput;

            auth.api.updateUser({
                body: {
                    name: `${patientData.firstName} ${patientData.lastName}`
                },
                headers: await headers() // Get request headers
            });
            // Update database
            await db.patient.update({
                where: { id: pid },
                data: {
                    ...patientData,
                    updatedAt: new Date()
                }
            });

            // Revalidate patient-related caches
            revalidateTag(`patient-${pid}`, 'max');
            revalidateTag('patients-list', 'max');
            updateTag('patient-stats');

            // Also revalidate appointment caches for this patient
            revalidateTag(`appointments-patient-${pid}`, 'max');

            return {
                success: true,
                error: false,
                message: 'Patient information updated successfully',
                data: { patientId: pid }
            };
        } catch (error) {
            console.error('Update patient error:', error);
            throw error;
        }
    });

// Create new patient with caching
export const createNewPatient = patientActionClient
    .metadata({ requireAuth: true })
    .inputSchema(PatientCreateSchema)
    .action(async ({ parsedInput }) => {
        try {
            const session = await getSession();
            if (!session?.user) {
                throw new Error('Unauthorized - Only authorized staff can create patients');
            }

            const { pid, ...patientData } = parsedInput;
            let patientId = pid;

            // Create or update Clerk user
            if (pid === 'new-patient') {
                // Create user using Better Auth admin plugin
                const { user } = await auth.api.createUser({
                    body: {
                        email: patientData.email ?? '',
                        password: patientData.phone ?? '', // Consider using a more secure default
                        name: `${patientData.firstName} ${patientData.lastName}`,
                        role: 'patient',
                        data: {
                            createdAt: new Date().toISOString(),
                            firstName: patientData.firstName,
                            lastName: patientData.lastName
                        }
                    },
                    headers: await headers()
                });
                patientId = user.id;
            } else {
                // Update existing user
                await auth.api.adminUpdateUser({
                    body: {
                        userId: pid,
                        data: {
                            role: 'patient',
                            updatedAt: new Date().toISOString(),
                            firstName: patientData.firstName,
                            lastName: patientData.lastName
                        }
                    },
                    headers: await headers()
                });
            }
            // Create patient in database

            // Update all relevant caches
            revalidateTag('patients-list', 'max');
            revalidateTag('recent-patients', 'max');
            updateTag('patient-stats');

            // Create specific cache for this patient
            cacheTag(`patient-${patientId}`);

            return {
                success: true,
                error: false,
                message: 'Patient created successfully',
                data: {
                    patientId,
                    name: `${patientData.firstName} ${patientData.lastName}`,
                    email: patientData.email
                }
            };
        } catch (error) {
            console.error('Create patient error:', error);
            throw error;
        }
    });

// ==================== CACHED PATIENT QUERIES ====================

// Get patient details with cache
export async function getPatientDetails(patientId: string) {
    'use cache';
    cacheTag(`patient-${patientId}`);

    const patient = await db.patient.findUnique({
        where: { id: patientId },
        include: {
            appointments: {
                take: 5,
                orderBy: { appointmentDate: 'desc' },
                include: {
                    doctor: {
                        include: {
                            user: {
                                select: { name: true }
                            }
                        }
                    }
                }
            },
            medicalRecords: {
                take: 3,
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!patient) {
        throw new Error(`Patient ${patientId} not found`);
    }

    return patient;
}

// Get patients list with pagination and cache
export async function getPatientsList(options: { page?: number; limit?: number; search?: string } = {}) {
    'use cache';
    cacheTag('patients-list');

    const { page = 1, limit = 20, search = '' } = options;
    const skip = (page - 1) * limit;

    const whereClause: PatientWhereInput = search
        ? {
              OR: [
                  { firstName: { contains: search, mode: 'insensitive' } },
                  { lastName: { contains: search, mode: 'insensitive' } },
                  { email: { contains: search, mode: 'insensitive' } },
                  { phone: { contains: search, mode: 'insensitive' } }
              ]
          }
        : {};

    const [patients, total] = await Promise.all([
        db.patient.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                dateOfBirth: true,
                gender: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: {
                        appointments: true,
                        medicalRecords: true
                    }
                }
            }
        }),
        db.patient.count({ where: whereClause })
    ]);

    return {
        patients,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

// Get recent patients for dashboard
export async function getRecentPatients(limit = 10) {
    'use cache';
    cacheTag('recent-patients');

    const patients = await db.patient.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            createdAt: true
        }
    });

    return patients;
}

// Get patient statistics
export async function getPatientStats() {
    'use cache';
    cacheTag('patient-stats');

    const [totalPatients, newThisMonth, newThisWeek, byGender] = await Promise.all([
        db.patient.count(),
        db.patient.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            }
        }),
        db.patient.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        }),
        db.patient.groupBy({
            by: ['gender'],
            _count: true
        })
    ]);

    return {
        totalPatients,
        newThisMonth,
        newThisWeek,
        byGender: byGender.reduce(
            (acc, item) => {
                acc[item.gender || 'unknown'] = item._count;
                return acc;
            },
            {} as Record<string, number>
        ),
        averageAge: await calculateAverageAge()
    };
}
// Helper function to calculate average patient age
async function calculateAverageAge() {
    const patients = await db.patient.findMany({
        select: {
            dateOfBirth: true
        }
    });

    if (patients.length === 0) return 0;

    const totalAge = patients.reduce((sum, patient) => {
        const birthDate = new Date(patient.dateOfBirth);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        return sum + age;
    }, 0);

    return Math.round(totalAge / patients.length);
}

// Get patient appointments with cache
export async function getPatientAppointments(patientId: string) {
    'use cache';
    cacheTag(`appointments-patient-${patientId}`);

    const appointments = await db.appointment.findMany({
        where: { patientId },
        include: {
            doctor: {
                include: {
                    user: {
                        select: { name: true, email: true }
                    }
                }
            },
            service: {
                select: { serviceName: true, price: true }
            }
        },
        orderBy: { appointmentDate: 'desc' }
    });

    return appointments;
}

// Delete patient action (with proper cleanup)
export const deletePatient = patientActionClient
    .metadata({ requireAuth: true })
    .inputSchema(
        z.object({
            patientId: z.string().min(1, 'Patient ID is required'),
            reason: z.string().optional()
        })
    )
    .action(async ({ parsedInput }) => {
        const session = await getSession();
        if (!session?.user) {
            throw new Error('Unauthorized');
        }

        const { patientId } = parsedInput;

        // Check if patient has active appointments
        const activeAppointments = await db.appointment.count({
            where: {
                patientId,
                status: { in: ['SCHEDULED', 'PENDING'] }
            }
        });

        if (activeAppointments > 0) {
            throw new Error(`Patient has ${activeAppointments} active appointments. Cancel them first.`);
        }

        try {
            // First, get the user ID associated with this patient
            const patient = await db.patient.findUnique({
                where: { id: patientId },
                select: { userId: true }
            });

            if (!patient) {
                throw new Error('Patient not found');
            }

            // Archive patient instead of hard delete (recommended for medical records)
            await db.patient.update({
                where: { id: patientId },
                data: {
                    status: 'DORMANT',
                    deletedAt: new Date(),
                    updatedById: session.user.id
                }
            });

            // If there's an associated user account, update it too
            if (patient.userId) {
                try {
                    // Update existing user - make sure you have proper auth setup
                    // This depends on your auth library implementation
                    // Example with NextAuth or similar:
                    // await auth.api.adminUpdateUser({
                    //     userId: patient.userId,
                    //     data: {
                    //         role: 'patient',
                    //         updatedAt: new Date().toISOString(),
                    //         status: 'DORMANT',
                    //     }
                    // });

                    // Alternatively, if you have a User model in Prisma:
                    await db.user.update({
                        where: { id: patient.userId },
                        data: {
                            deletedAt: new Date(),
                            updatedAt: new Date()
                        }
                    });
                } catch (error) {
                    console.warn('Could not update user account:', error);
                    // Continue with patient archiving even if user update fails
                }
            }

            // Invalidate all patient-related caches
            // Note: revalidateTag typically needs a path argument in Next.js 15+
            revalidateTag('patients-list', '/patients');
            revalidateTag('recent-patients', '/dashboard');
            revalidateTag('patient-stats', '/dashboard');
            revalidateTag(`patient-${patientId}`, `/patients/${patientId}`);

            // If you have a custom updateTag function, use it
            if (typeof updateTag === 'function') {
                updateTag('patient-stats');
            }

            return {
                success: true,
                message: 'Patient archived successfully',
                data: { patientId }
            };
        } catch (error) {
            console.error('Error archiving patient:', error);
            throw new Error(`Failed to archive patient: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    });
