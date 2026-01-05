// components/patient-rating-container.tsx
import { getSession } from '@/lib/auth/server';
import db from '@/lib/db';

import { RatingList } from './rating-list';

interface PatientRatingContainerProps {
    patientId?: string;
    limit?: number;
    title?: string;
}

export const PatientRatingContainer = async ({
    patientId,
    limit = 10,
    title = 'Patient Reviews'
}: PatientRatingContainerProps) => {
    const session = await getSession();
    const currentUserId = session?.user.id ?? '';
    const targetPatientId = patientId || currentUserId;

    if (!targetPatientId) {
        return (
            <div className='rounded-lg bg-white p-6'>
                <p className='text-gray-600'>Please log in to view ratings.</p>
            </div>
        );
    }

    const ratings = await db.rating.findMany({
        take: limit,
        where: {
            patientId: targetPatientId,
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

    if (!ratings || ratings.length === 0) {
        return (
            <div className='rounded-lg bg-white p-6'>
                <div className='flex items-center justify-between p-4'>
                    <h1 className='font-semibold text-xl'>{title}</h1>
                </div>
                <div className='p-4 text-center text-gray-600'>
                    <p>No reviews yet. Be the first to leave a review!</p>
                </div>
            </div>
        );
    }

    // Calculate average rating
    const averageRating =
        ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length : 0;

    return (
        <div className='space-y-4'>
            {/* Stats Summary */}
            <div className='rounded-lg bg-white p-4'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h2 className='font-semibold text-lg'>Rating Summary</h2>
                        <p className='text-muted-foreground text-sm'>
                            Based on {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                    <div className='text-center'>
                        <div className='font-bold text-3xl'>{averageRating.toFixed(1)}</div>
                        <div className='text-muted-foreground text-sm'>out of 5</div>
                    </div>
                </div>
            </div>

            {/* Rating List */}
            <RatingList
                ratings={ratings}
                title={title}
            />
        </div>
    );
};
