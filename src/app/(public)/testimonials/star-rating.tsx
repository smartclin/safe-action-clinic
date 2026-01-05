import { Star } from 'lucide-react';

type StarRatingProps = {
    rating: number;
    max?: number;
    id?: string;
};

export function StarRating({ rating, max = 5, id = 'rating' }: StarRatingProps) {
    return (
        <div className='flex items-center gap-1'>
            {/* Accessible text for screen readers */}
            <span className='sr-only'>
                Rated {rating} out of {max} stars
            </span>

            {Array.from({ length: max }, (_, position) => {
                const starNumber = position + 1;
                const isFilled = starNumber <= rating;

                return (
                    <Star
                        aria-hidden='true'
                        className={`h-4 w-4 ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                        key={`${id}-star-${starNumber}`}
                    />
                );
            })}
        </div>
    );
}
