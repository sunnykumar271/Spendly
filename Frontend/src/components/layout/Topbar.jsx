// src/components/layout/Topbar.jsx
import { Menu, Sun, Moon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../features/theme/themeSlice'

const Topbar = ({ onMenuClick, title }) => {
  const dispatch   = useDispatch()
  const { mode }   = useSelector((s) => s.theme)

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 sm:px-6
                        bg-white/80 dark:bg-surface-800/80 backdrop-blur-md
                        border-b border-surface-100 dark:border-surface-700">
      {/* Left: hamburger + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden btn-ghost btn p-2 rounded-lg"
          aria-label="Open menu"
        >
          <Menu size={19} />
        </button>
        {title && (
          <h1 className="text-base font-display font-semibold text-surface-800 dark:text-white hidden sm:block">
            {title}
          </h1>
        )}
      </div>

      {/* Right: theme toggle */}
      <button
        onClick={() => dispatch(toggleTheme())}
        className="btn-ghost btn p-2 rounded-xl"
        aria-label="Toggle theme"
      >
        {mode === 'dark'
          ? <Sun  size={18} className="text-amber-400" />
          : <Moon size={18} className="text-surface-500" />
        }
      </button>
    </header>
  )
}

export default Topbar
