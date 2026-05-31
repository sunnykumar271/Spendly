// src/components/common/Spinner.jsx
const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-10 h-10' }
  return (
    <div className={`${sizes[size]} ${className} animate-spin rounded-full border-2 border-surface-200 border-t-primary-600`} />
  )
}

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>
    </div>
  </div>
)

export default Spinner
