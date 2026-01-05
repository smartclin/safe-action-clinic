'use server';

import { cache } from 'react';

import type { StaffWhereInput } from '@/generated/models';
import db from '@/lib/db';
import type { Status, UserRole } from '@/types';

interface GetStaffListOptions {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
    status?: string;
    department?: string;
}

export const getStaffList = cache(async (options: GetStaffListOptions = {}) => {
    const { page = 1, limit = 20, search = '', role, department } = options;

    const skip = (page - 1) * limit;

    const where: StaffWhereInput = {};

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } }
        ];
    }

    if (role) {
        where.role = role;
    }
    const normalizedStatus: Status | undefined = options.status === 'all' ? undefined : (options.status as Status);
    if (normalizedStatus) {
        where.status = normalizedStatus;
    }

    if (department && department !== 'all') {
        where.department = department;
    }

    const [staff, total] = await Promise.all([
        db.staff.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        image: true,
                        createdAt: true
                    }
                }
            }
        }),
        db.staff.count({ where })
    ]);

    const formattedStaff = staff.map(s => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone || '',
        role: s.role,
        department: s.department || '',
        status: s.status,
        hireDate: s.hireDate?.toISOString() || s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
        address: s.address || '',
        image: s.img || '',
        licenseNumber: s.licenseNumber || '',
        salary: s.salary || '',
        createdAt: s.createdAt.toISOString()
    }));

    return {
        staff: formattedStaff,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
});

export const getStaffStats = cache(async () => {
    const [total, active, doctors, onDuty, byRole, byDepartment] = await Promise.all([
        db.staff.count(),
        db.staff.count({ where: { status: 'ACTIVE' } }),
        db.staff.count({ where: { role: 'DOCTOR', status: 'ACTIVE' } }),
        db.staff.count({ where: { status: 'ACTIVE' } }),
        db.staff.groupBy({
            by: ['role'],
            _count: true
        }),
        db.staff.groupBy({
            by: ['department'],
            _count: true,
            orderBy: {
                _count: {
                    department: 'desc'
                }
            },
            take: 5
        })
    ]);

    // Calculate average tenure (simplified)
    const staffWithHireDate = await db.staff.findMany({
        where: { hireDate: { not: null } },
        select: { hireDate: true }
    });

    const averageTenure =
        staffWithHireDate.length > 0
            ? (
                  staffWithHireDate.reduce((sum, s) => {
                      const years = s.hireDate ? (Date.now() - s.hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365) : 0;
                      return sum + years;
                  }, 0) / staffWithHireDate.length
              ).toFixed(1)
            : '0';

    return {
        total,
        active,
        doctors,
        onDuty,
        averageTenure: `${averageTenure} years`,
        turnoverRate: '5%',
        byRole,
        byDepartment
    };
});

export async function deleteStaff(staffId: string) {
    try {
        // First, archive the staff record
        await db.staff.update({
            where: { id: staffId },
            data: {
                status: 'INACTIVE',
                deletedAt: new Date()
            }
        });

        // Don't delete the user account, just mark as inactive
        await db.user.update({
            where: { id: staffId },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to delete staff:', error);
        return { success: false, error: 'Failed to delete staff member' };
    }
}
