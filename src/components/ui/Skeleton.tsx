interface PosterSkeletonGridProps {
  count: number;
}

/**
 * Placeholder that matches the real grid's shape, so the layout does not shift
 * when the data lands.
 */
export function PosterSkeletonGrid({ count }: PosterSkeletonGridProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} aria-hidden="true">
          <div className="aspect-[2/3] animate-pulse rounded-card bg-surface" />
          <div className="mt-3 h-4 w-3/4 animate-pulse rounded-full bg-surface" />
          <div className="mt-2 h-3 w-1/3 animate-pulse rounded-full bg-surface" />
        </div>
      ))}
    </>
  );
}
