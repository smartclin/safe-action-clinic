// app/api/ratings/route.ts
import { type NextRequest, NextResponse } from 'next/server';

import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const patientId = searchParams.get('patientId');
        const limit = Number.parseInt(searchParams.get('limit') || '10', 10);

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
        }

        const ratings = await db.rating.findMany({
            take: limit,
            where: {
                patientId,
                patient: {
                    isDeleted: false
                }
            },
            include: {
                patient: {
                    select: {
                        firstName: true,
                        lastName: true,
                        userId: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            ratings: ratings.map(rating => ({
                ...rating,
                createdAt: rating.createdAt.toISOString()
            }))
        });
    } catch (error) {
        console.error('Error fetching ratings:', error);
        return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
    }
}
