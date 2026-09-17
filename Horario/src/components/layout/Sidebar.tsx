import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'
import { LogoutIcon } from './icons'
import * as authService from '../../services/auth/authService'

/** Desktop-only (lg+). Mobile/tablet use MobileTopBar + BottomNav instead. */
export function Sidebar() {
  async function handleLogout() {
    await authService.logout()
  }

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col gap-6 border-r border-white/60 bg-white/70 p-5 shadow-glass backdrop-blur-xl lg:flex">
      <span className="px-2 text-lg font-bold text-primary-600">Horario</span>

      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-clay-sm px-3 py-2.5 text-sm font-medium transition-[background-color,box-shadow,transform] duration-200 ease-clay motion-reduce:transition-none ${
                isActive
                  ? 'bg-white text-primary-700 shadow-clay'
                  : 'text-slate-600 hover:translate-x-0.5 hover:bg-white/60 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => void handleLogout()}
        className="flex items-center gap-3 rounded-clay-sm px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors duration-200 hover:bg-white/60 hover:text-slate-800"
      >
        <LogoutIcon className="h-5 w-5 shrink-0" />
        Log Out
      </button>
    </aside>
  )
}
