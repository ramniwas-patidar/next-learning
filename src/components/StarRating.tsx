export default function StarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index < Math.round(rating);
          return (
            <svg
              key={index}
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5"
              fill={filled ? "#FBC210" : "#E5E5E5"}
            >
              <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.77l-5.2 2.75.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
            </svg>
          );
        })}
      </div>
      <span className="text-xs font-medium text-[#636E6E]">
        {rating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  );
}
