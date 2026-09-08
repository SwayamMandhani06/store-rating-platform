import { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StarRating({
  value = 0,
  onChange,
  interactive = false,
  size = 'w-5 h-5',
}) {
  const [hovered, setHovered] = useState(null);
  const stars = [1, 2, 3, 4, 5];

  const activeRating = hovered !== null ? hovered : Math.round(value || 0);

  return (
    <div className="inline-flex items-center gap-1" onMouseLeave={() => interactive && setHovered(null)}>
      {stars.map((n) => {
        const isFilled = n <= activeRating;

        return (
          <motion.button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(n)}
            onMouseEnter={() => interactive && setHovered(n)}
            whileHover={interactive ? { scale: 1.18 } : undefined}
            whileTap={interactive ? { scale: 0.9 } : undefined}
            className={`transition-colors rounded-sm focus:outline-none ${
              interactive
                ? 'cursor-pointer p-1 -m-1 sm:p-0.5 sm:-m-0.5 min-w-[32px] min-h-[32px] sm:min-w-0 sm:min-h-0 flex items-center justify-center'
                : 'cursor-default pointer-events-none'
            }`}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
          >
            <Star
              className={`${size} transition-colors ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                  : 'fill-slate-100 text-slate-300'
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
}
