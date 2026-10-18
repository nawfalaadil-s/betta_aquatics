import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'sm',
  showNumber = true,
  reviewCount,
}) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      role="img"
      className="inline-flex items-center gap-1.5"
      aria-label={`Rating: ${rating} out of ${maxStars}`}
    >
      <div className="flex items-center text-red-600" aria-hidden="true">
        {[...Array(maxStars)].map((_, index) => {
          const filled = index < Math.floor(rating);
          const half = !filled && index < rating;
          return (
            <Star
              key={index}
              className={`${iconSizes[size]} ${
                filled
                  ? 'fill-red-600 text-red-600'
                  : half
                  ? 'fill-red-600/50 text-red-600'
                  : 'text-slate-200 fill-slate-100'
              }`}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-900" aria-hidden="true">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-slate-600 font-normal" aria-hidden="true">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
