interface Props {
  rating: number;
}

export function StarRating({ rating }: Props) {
  return (
    <>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`bi ${star <= rating ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
        >
        </i>
      ))}
    </>
  );
}