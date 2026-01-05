'use server';

import { revalidateTag, updateTag } from 'next/cache';
import { headers } from 'next/headers';

import { reviewSchema } from '@/components/dialogs/review-form';
import { auth } from '@/lib/auth';
import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';
import { checkRole } from '@/utils/roles';

export async function deleteDataById({ id, deleteType }: { id: string; deleteType: string }) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return {
                success: false,
                message: 'Unauthorized',
                error: true
            };
        }

        // Check if user has admin role
        const isAdmin = await checkRole('admin');
        if (!isAdmin) {
            return {
                success: false,
                message: 'Insufficient permissions',
                error: true
            };
        }

        switch (deleteType) {
            case 'doctor':
                // Soft delete for doctors
                await db.doctor.update({
                    where: { id },
                    data: {
                        isDeleted: true,
                        deletedAt: new Date()
                    }
                });
                revalidateTag('doctors-list', 'max');
                break;

            case 'staff':
                // Soft delete for staff
                await db.staff.update({
                    where: { id },
                    data: {
                        deletedAt: new Date(),
                        status: 'INACTIVE'
                    }
                });

                // Also update the user status in auth
                try {
                    const staff = await db.staff.findUnique({
                        where: { id },
                        select: { userId: true }
                    });

                    if (staff?.userId) {
                        // Use the admin plugin's banUser method instead
                        await auth.api.banUser({
                            body: {
                                userId: staff.userId,
                                banReason: 'Staff account deactivated'
                            },
                            headers: await headers()
                        });
                    }
                } catch (error) {
                    console.error('Failed to ban auth user:', error);
                }

                revalidateTag('staff-list', 'max');
                break;

            case 'patient':
                // Soft delete for patients
                await db.patient.update({
                    where: { id },
                    data: {
                        isDeleted: true,
                        deletedAt: new Date(),
                        status: 'INACTIVE'
                    }
                });

                // Update patient's user account
                try {
                    const patient = await db.patient.findUnique({
                        where: { id },
                        select: { userId: true }
                    });

                    if (patient?.userId) {
                        // Use the admin plugin's banUser method instead
                        await auth.api.banUser({
                            body: {
                                userId: patient.userId,
                                banReason: 'Patient account deactivated'
                            },
                            headers: await headers()
                        });
                    }
                } catch (error) {
                    console.error('Failed to ban auth user:', error);
                }

                revalidateTag('patients-list', 'max');
                break;

            case 'payment':
                await db.payment.update({
                    where: { id },
                    data: {
                        isDeleted: true,
                        deletedAt: new Date()
                    }
                });
                revalidateTag('payments-list', 'max');
                break;

            case 'bill':
                await db.patientBill.delete({
                    where: { id }
                });
                revalidateTag('bills-list', 'max');
                break;

            case 'appointment':
                await db.appointment.update({
                    where: { id },
                    data: {
                        isDeleted: true,
                        deletedAt: new Date(),
                        status: 'CANCELLED'
                    }
                });
                revalidateTag('appointments-list', 'max');
                break;

            case 'service':
                await db.service.update({
                    where: { id },
                    data: {
                        isDeleted: true,
                        deletedAt: new Date(),
                        isAvailable: false
                    }
                });
                revalidateTag('services-list', 'max');
                break;

            case 'clinic':
                await db.clinic.update({
                    where: { id },
                    data: {
                        isDeleted: true,
                        deletedAt: new Date()
                    }
                });
                revalidateTag('clinics-list', 'max');
                break;

            default:
                return {
                    success: false,
                    message: 'Invalid delete type',
                    error: true
                };
        }

        // Update dashboard statistics
        updateTag('dashboard-stats');

        // Also update relevant cache tags
        updateTag('admin-stats');

        return {
            success: true,
            message: `${deleteType.charAt(0).toUpperCase() + deleteType.slice(1)} deleted successfully`
        };
    } catch (error) {
        console.error('Delete error:', error);

        // Check for foreign key constraints
        if (error instanceof Error && error.message.includes('foreign')) {
            return {
                success: false,
                message: 'Cannot delete this record because it is referenced by other records',
                error: true
            };
        }

        return {
            success: false,
            message: 'An error occurred while deleting the record',
            error: true
        };
    }
}
export async function createReview(input: unknown) {
    const session = await getSession();

    if (!session?.user?.id) {
        return {
            success: false,
            message: 'Unauthorized'
        };
    }

    const validatedData = reviewSchema.parse(input);

    await db.rating.create({
        data: {
            patientId: validatedData.patientId,
            rating: validatedData.rating,
            comment: validatedData.comment,
            staffId: session.user.id // ✅ always trusted
        }
    });

    return {
        success: true,
        message: 'Review created successfully'
    };
}
