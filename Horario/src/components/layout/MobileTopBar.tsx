import { LogoutIcon } from './icons'
import { NotificationsToggle } from './NotificationsToggle'
import * as authService from '../../services/auth/authService'

/** Mobile/tablet only (below lg) — brand + account action; primary nav lives in BottomNav. */
export function MobileTopBar() {
  async function handleLogout() {
    await authService.logout()
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur-md lg:hidden print:hidden">
      <span className="text-lg font-semibold tracking-tight text-slate-900">
        Horario<span className="text-primary-600">.</span>
      </span>
      <div className="flex items-center gap-1">
        <NotificationsToggle compact />
        <button
          type="button"
          onClick={() => void handleLogout()}
          aria-label="Log out"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-800"
        >
          <LogoutIcon className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
