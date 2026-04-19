import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, numReviews, color = 'text-amazon', size = 'text-sm' }) => {
  const stars = [1, 2, 3, 4, 5].map((star) => {
    if (value >= star) return <FaStar key={star} />;
    if (value >= star - 0.5) return <FaStarHalfAlt key={star} />;
    return <FaRegStar key={star} />;
  });

  return (
    <div className="flex items-center gap-1">
      <div className={`flex items-center gap-0.5 ${color} ${size}`}>{stars}</div>
      {numReviews !== undefined && (
        <span className="text-amazon-teal text-xs hover:underline cursor-pointer">
          ({numReviews.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default Rating;
