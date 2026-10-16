import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'

/** Mobile/tablet only (below lg) — desktop uses Sidebar instead. */
export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/60 bg-white/80 shadow-glass backdrop-blur-xl lg:hidden print:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex min-w-[4rem] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors duration-200 ${
                isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-[background-color,transform] duration-200 ease-clay motion-reduce:transition-none ${
                    isActive ? 'theme-surface -translate-y-0.5 text-white' : ''
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
