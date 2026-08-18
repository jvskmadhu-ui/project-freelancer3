import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5.0, maxStars = 5, size = 'sm', reviewsCount = null }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;

  for (let i = 1; i <= maxStars; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
      );
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400/50" />
      );
    } else {
      stars.push(
        <Star key={i} className="w-4 h-4 text-slate-600" />
      );
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">{stars}</div>
      <span className="text-xs font-bold text-slate-200">
        {Number(rating).toFixed(1)}
      </span>
      {reviewsCount !== null && (
        <span className="text-xs text-slate-400">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
