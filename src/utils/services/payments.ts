import type { PaymentWhereInput } from '@/generated/models';
import db from '@/lib/db';

export async function getPaymentRecords({
    page,
    limit,
    search
}: {
    page: number | string;
    limit?: number | string;
    search?: string;
}) {
    'use cache';
    try {
        const PAGE_NUMBER = Number(page) <= 0 ? 1 : Number(page);
        const LIMIT = Number(limit) || 10;

        const SKIP = (PAGE_NUMBER - 1) * LIMIT;

        const where: PaymentWhereInput = {
            OR: [
                {
                    patient: {
                        firstName: { contains: search, mode: 'insensitive' }
                    }
                },
                {
                    patient: {
                        lastName: { contains: search, mode: 'insensitive' }
                    }
                },
                { patientId: { contains: search, mode: 'insensitive' } }
            ]
        };

        const [data, totalRecords] = await Promise.all([
            db.payment.findMany({
                where: where,
                include: {
                    patient: {
                        select: {
                            firstName: true,
                            lastName: true,
                            dateOfBirth: true,
                            image: true,
                            colorCode: true,
                            gender: true
                        }
                    }
                },
                skip: SKIP,
                take: LIMIT,
                orderBy: { createdAt: 'desc' }
            }),
            db.payment.count({
                where
            })
        ]);

        const totalPages = Math.ceil(totalRecords / LIMIT);

        return {
            success: true,
            data,
            totalRecords,
            totalPages,
            currentPage: PAGE_NUMBER,
            status: 200
        };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal Server Error', status: 500 };
    }
}
