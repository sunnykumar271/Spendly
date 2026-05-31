// src/components/common/EmptyState.jsx
const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="text-5xl mb-4 opacity-60">{icon || '📭'}</div>
    <h3 className="text-base font-display font-semibold text-surface-700 dark:text-surface-300 mb-1">
      {title || 'Nothing here yet'}
    </h3>
    <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xs mb-5">
      {description || 'Add something to get started.'}
    </p>
    {action && action}
  </div>
)

export default EmptyState
