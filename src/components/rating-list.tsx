// components/rating-list.tsx
'use client';

import { Star } from 'lucide-react';

interface Rating {
    id: number;
    createdAt: Date;
    rating: number;
    comment: string | null;
    patient?: {
        firstName: string;
        lastName: string;
    } | null;
}

interface RatingListProps {
    ratings: Rating[];
    title?: string;
    emptyMessage?: string;
}

export const RatingList = ({
    ratings,
    title = 'Patient Reviews',
    emptyMessage = 'No reviews yet'
}: RatingListProps) => {
    if (!ratings || ratings.length === 0) {
        return (
            <div className='rounded-lg bg-white p-6'>
                <div className='flex items-center justify-between p-4'>
                    <h1 className='font-semibold text-xl'>{title}</h1>
                </div>
                <div className='p-4 text-center text-gray-600'>
                    <p>{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='rounded-lg bg-white'>
            <div className='flex items-center justify-between p-4'>
                <h1 className='font-semibold text-xl'>{title}</h1>
                <span className='text-muted-foreground text-sm'>
                    {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
                </span>
            </div>

            <div className='space-y-2 p-2'>
                {ratings.map(rating => (
                    <div
                        className='rounded p-3 even:bg-gray-50'
                        key={rating.id}
                    >
                        <div className='flex justify-between'>
                            <div className='flex items-center gap-4'>
                                <div>
                                    <p className='font-medium text-base'>
                                        {rating.patient
                                            ? `${rating.patient.firstName} ${rating.patient.lastName}`
                                            : 'Anonymous Patient'}
                                    </p>
                                    {rating.comment && <p className='mt-1 text-gray-600 text-sm'>{rating.comment}</p>}
                                </div>
                                <span className='text-gray-500 text-sm'>
                                    {new Date(rating.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <div className='flex flex-col items-center'>
                                <div className='flex items-center text-yellow-600'>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <Star
                                            className={`h-4 w-4 ${
                                                index < rating.rating ? 'fill-yellow-600' : 'text-gray-300'
                                            }`}
                                            key={`${rating.id}-${index}`}
                                        />
                                    ))}
                                </div>
                                <span className='mt-1 font-medium text-gray-700 text-sm'>
                                    {rating.rating.toFixed(1)}/5.0
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
