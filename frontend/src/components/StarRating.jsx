import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

/**
 * Renders a 5-star rating with partial stars and an optional review count.
 */
const StarRating = ({ rate = 0, count, size = 'text-sm' }) => {
  const full = Math.floor(rate);
  const hasHalf = rate - full >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className={`flex items-center gap-1 ${size}`}>
      <div className="flex text-marigold-500">
        {Array.from({ length: full }).map((_, i) => (
          <FaStar key={`f-${i}`} />
        ))}
        {hasHalf && <FaStarHalfAlt key="half" />}
        {Array.from({ length: empty }).map((_, i) => (
          <FaRegStar key={`e-${i}`} />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-ink-400 dark:text-ink-400">({count})</span>
      )}
    </div>
  );
};

export default StarRating;
