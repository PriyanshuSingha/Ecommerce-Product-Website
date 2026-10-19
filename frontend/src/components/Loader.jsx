/** Full-section spinner used while data is in flight. */
export const Spinner = ({ label = 'Loading' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20" role="status" aria-live="polite">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink-200 border-t-marigold-400 dark:border-ink-700 dark:border-t-marigold-400" />
    <p className="text-sm text-ink-500 dark:text-ink-400">{label}\u2026</p>
  </div>
);

/** Skeleton placeholder shaped like a ProductCard, for grid loading states. */
export const ProductCardSkeleton = () => (
  <div className="card-surface overflow-hidden">
    <div className="skeleton aspect-square w-full" />
    <div className="space-y-3 p-4">
      <div className="skeleton h-3 w-1/3 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="perforation" />
      <div className="skeleton h-6 w-1/2 rounded" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);
