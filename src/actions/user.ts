import 'server-only';

import { cache } from 'react';

import type { UserWhereInput } from '@/generated/models';
import db from '@/lib/db';
import type { UserRole } from '@/types';

interface GetUserListOptions {
    page?: number;
    limit?: number;
    search?: string;
    role?: UserRole;
}

export const getUserList = cache(async (options: GetUserListOptions) => {
    const { page = 1, limit = 20, search = '', role } = options;

    const skip = (page - 1) * limit;

    const where: UserWhereInput = {};

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

    const [users, total] = await Promise.all([
        db.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                createdAt: true
            }
        }),
        db.user.count({ where })
    ]);

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
});
