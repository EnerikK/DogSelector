import { useState } from "react";

interface Props {
  rating?: number;
  onChange?: (rating: number) => void;
}

export function StarRating({ rating = 0, onChange }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div style={{ cursor: "pointer", display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = hover ? star <= hover : star <= rating;

        return (
          <i
            key={star}
            className={`bi ${
              active ? "bi-star-fill text-warning" : "bi-star text-muted"
            }`}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
          />
        );
      })}
    </div>
  );
}