import { useState } from "react";

interface Props {
  rating?: number;
  onChange?: (rating: number) => void | Promise<void>;
}

export function StarRating({ rating = 0, onChange }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const readOnly = !onChange;

  const handleClick = (star: number) => {
    if (!onChange) return;

    const nextRating = star === rating ? Math.max(star - 1, 0) : star;
    void onChange(nextRating);
  };

  return (
    <div
      aria-label={`Rating ${rating} out of 5`}
      className="star-rating"
      role={readOnly ? "img" : "group"}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const active = hover ? star <= hover : star <= rating;

        return (
          <button
            type="button"
            key={star}
            className={`star-rating-button bi ${
              active ? "bi-star-fill text-warning" : "bi-star text-muted"
            }`}
            aria-label={`Set rating to ${star}`}
            disabled={readOnly}
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => setHover(null)}
          />
        );
      })}
    </div>
  );
}
