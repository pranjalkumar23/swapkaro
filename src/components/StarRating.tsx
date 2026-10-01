export function StarRating({ rating, count, size = "sm" }: { rating: number; count: number; size?: "sm" | "md" }) {
  if (count === 0) {
    return <span className="text-xs text-[var(--color-ink-muted)]">No ratings yet</span>;
  }

  const full = Math.round(rating);
  const textSize = size === "md" ? "text-base" : "text-xs";

  return (
    <span className={`inline-flex items-center gap-1 ${textSize} text-[var(--color-ink-muted)]`}>
      <span className="text-[var(--color-accent)]" aria-hidden>
        {"★".repeat(full)}
        {"☆".repeat(5 - full)}
      </span>
      <span>
        {rating.toFixed(1)} ({count})
      </span>
    </span>
  );
}
