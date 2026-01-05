'use server';

import { revalidateTag, updateTag } from 'next/cache';
import { headers } from 'next/headers';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import { auth } from '@/lib/auth';
import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';
import { DoctorSchema, ServicesSchema, StaffSchema, workingDaySchema } from '@/schema';
import { generateRandomColor } from '@/utils';
import { checkRole } from '@/utils/roles';

// Create safe action client with proper error handling
const actionClient = createSafeActionClient({
    handleServerError: error => {
        console.error('Admin action error:', error);
        return {
            success: false,
            message: 'An error occurred. Please try again.',
            error: true
        };
    },
    defineMetadataSchema: () =>
        z.object({
            role: z.enum(['ADMIN', 'STAFF']).optional()
        })
});

// Create staff action with caching and revalidation
export const createNewStaff = actionClient
    .metadata({ role: 'ADMIN' }) // Only admins can execute
    .inputSchema(StaffSchema)
    .action(async ({ parsedInput }) => {
        try {
            // Check session
            const session = await getSession();
            if (!session?.user) {
                return { success: false, message: 'Unauthorized', error: true };
            }

            // Check role
            const isAdmin = await checkRole('ADMIN');
            if (!isAdmin) {
                return { success: false, message: 'Unauthorized', error: true };
            }

            // Destructure password separately
            const { password, ...staffData } = parsedInput;

            // Create user using Better Auth
            const user = await db.user.create({
                data: {
                    email: staffData.email,
                    name: staffData.name,
                    emailVerified: true
                }
            });

            // Set password for the user
            await auth.api.setPassword({
                body: {
                    newPassword: password || ''
                },
                headers: await headers()
            });

            // Create staff record
            const staff = await db.staff.create({
                data: {
                    name: staffData.name,
                    phone: staffData.phone || null,
                    email: staffData.email,
                    role: staffData.role,
                    licenseNumber: staffData.licenseNumber || null,
                    department: staffData.department || null,
                    colorCode: generateRandomColor(),
                    id: user.id,
                    address: staffData.address,
                    status: 'ACTIVE'
                }
            });

            // Invalidate relevant caches
            revalidateTag('staff-list', 'max');
            updateTag('admin-stats'); // Immediate update for admin dashboard

            return {
                success: true,
                message: 'Staff added successfully',
                error: false,
                data: { id: staff.id, email: staff.email }
            };
        } catch (error) {
            console.error('Create staff error:', error);
            throw new Error('Failed to create staff');
        }
    });

// Extended doctor schema with work schedule
const DoctorWithScheduleSchema = DoctorSchema.extend({
    workSchedule: z.array(workingDaySchema).optional()
});

// Create doctor action with caching
export const createNewDoctor = actionClient
    .metadata({ role: 'ADMIN' })
    .inputSchema(DoctorWithScheduleSchema)
    .action(async ({ parsedInput }) => {
        try {
            const { password, workSchedule, ...doctorData } = parsedInput;

            // Create user using Better Auth
            const user = await db.user.create({
                data: {
                    email: doctorData.email,
                    name: doctorData.name,
                    emailVerified: true
                }
            });

            // Set password
            await auth.api.setPassword({
                body: {
                    newPassword: password || ''
                },
                headers: await headers()
            });

            // Create doctor record
            const doctor = await db.doctor.create({
                data: {
                    ...doctorData,
                    phone: doctorData.phone || null,
                    address: doctorData.address || null,
                    specialty: doctorData.specialty,
                    appointmentPrice: 50, // Default price
                    id: user.id
                }
            });
            if (workSchedule && workSchedule.length > 0 && doctor) {
                await db.workingDays.createMany({
                    // We use a guard or non-null check inside the map
                    // to ensure 'el' is treated as a valid object
                    data: workSchedule.map(el => {
                        if (!el) throw new Error('Invalid schedule entry');

                        return {
                            day: el.day, // el is now recognized as a single object
                            startTime: el.startTime,
                            closeTime: el.closeTime,
                            doctorId: doctor.id
                        };
                    })
                });
            }
            // Update caches
            revalidateTag('doctors-list', 'max');
            revalidateTag('doctor-schedule', 'max');
            updateTag('available-doctors');

            return {
                success: true,
                message: 'Doctor added successfully',
                error: false,
                data: { id: doctor.id, name: doctor.name }
            };
        } catch (error) {
            console.error('Create doctor error:', error);
            throw new Error('Failed to create doctor');
        }
    });

// Service schema with required fields
const ServiceCreateSchema = ServicesSchema.extend({
    serviceName: z.string().min(1, 'Service name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().positive('Price must be positive')
});

// Create service action with caching
export const addNewService = actionClient
    .metadata({ role: 'ADMIN' })
    .inputSchema(ServiceCreateSchema)
    .action(async ({ parsedInput }) => {
        try {
            const service = await db.service.create({
                data: {
                    serviceName: parsedInput.serviceName,
                    description: parsedInput.description,
                    price: parsedInput.price
                }
            });

            // Update service caches
            revalidateTag('services-list', 'max');
            updateTag('service-prices');

            return {
                success: true,
                error: false,
                message: 'Service added successfully',
                data: { id: service.id, serviceName: service.serviceName }
            };
        } catch (error) {
            console.error('Create service error:', error);
            throw new Error('Failed to create service');
        }
    });

// Cached data fetching functions for admin dashboard
export async function getStaffList(params: { page: number; limit: number }) {
    'use cache';

    const staff = await db.staff.findMany({
        where: { status: 'ACTIVE' },
        include: {
            user: {
                select: { email: true, createdAt: true }
            }
        },
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit
    });

    return {
        staff: staff.map(s => ({
            ...s,
            updatedAt: s.updatedAt
        })),
        pagination: {
            page: params.page,
            totalPages: 5,
            totalItems: 100
        }
    };
}

export async function getDoctorsList(params: { page: number; limit: number }) {
    'use cache';

    const doctors = await db.doctor.findMany({
        include: {
            user: {
                select: { email: true }
            },
            workingDays: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit
    });

    return {
        doctors,
        pagination: {
            page: params.page,
            totalPages: 5,
            totalItems: 100
        }
    };
}

export async function getServicesList(params: { page: number; limit: number }) {
    'use cache';

    const services = await db.service.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (params.page - 1) * params.limit,
        take: params.limit
    });

    return {
        services,
        pagination: {
            page: params.page,
            totalPages: 5,
            totalItems: 100
        }
    };
}

// Admin statistics with cache tags
export async function getAdminStats() {
    'use cache';

    const [totalPatients, totalDoctors, totalAppointments, recentStaff] = await Promise.all([
        db.patient.count(),
        db.doctor.count(),
        db.appointment.count(),
        db.staff.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { email: true } } }
        })
    ]);

    return {
        totalPatients,
        totalDoctors,
        totalAppointments,
        recentStaff
    };
}
