import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'
import { LogoutIcon } from './icons'
import { NotificationsToggle } from './NotificationsToggle'
import * as authService from '../../services/auth/authService'

/** Desktop-only (lg+). Mobile/tablet use MobileTopBar + BottomNav instead. */
export function Sidebar() {
  async function handleLogout() {
    await authService.logout()
  }

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col gap-6 border-r border-slate-200 bg-slate-50 p-5 lg:flex print:hidden">
      <span className="px-2 text-xl font-semibold tracking-tight text-slate-900">
        Horario<span className="text-primary-600">.</span>
      </span>

      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-clay-sm px-2.5 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-clay ring-1 ring-slate-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-[background-color] duration-200 ${
                    isActive ? 'theme-surface text-white' : 'bg-transparent'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <NotificationsToggle />

      <button
        type="button"
        onClick={() => void handleLogout()}
        className="flex items-center gap-3 rounded-clay-sm px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-800"
      >
        <LogoutIcon className="h-5 w-5 shrink-0" />
        Log out
      </button>
    </aside>
  )
}
