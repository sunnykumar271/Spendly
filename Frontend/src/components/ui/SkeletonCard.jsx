// src/components/ui/SkeletonCard.jsx — loading placeholder
export const SkeletonCard = () => (
  <div className="card p-5 space-y-3 animate-pulse">
    <div className="flex gap-3 items-center">
      <div className="skeleton w-11 h-11 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-5 w-32 rounded" />
      </div>
    </div>
  </div>
)

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 py-3 animate-pulse">
    <div className="skeleton w-9 h-9 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="skeleton h-3.5 w-40 rounded" />
      <div className="skeleton h-3 w-24 rounded" />
    </div>
    <div className="skeleton h-4 w-16 rounded" />
  </div>
)

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-1 divide-y divide-surface-100 dark:divide-surface-700">
    {Array.from({ length: rows }).map((_, i) => <SkeletonRow key={i} />)}
  </div>
)
