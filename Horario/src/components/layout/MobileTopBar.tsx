import { LogoutIcon } from './icons'
import * as authService from '../../services/auth/authService'

/** Mobile/tablet only (below lg) — brand + account action; primary nav lives in BottomNav. */
export function MobileTopBar() {
  async function handleLogout() {
    await authService.logout()
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/60 bg-white/70 px-4 py-3 shadow-glass backdrop-blur-xl lg:hidden">
      <span className="text-base font-bold text-primary-600">Horario</span>
      <button
        type="button"
        onClick={() => void handleLogout()}
        aria-label="Log out"
        className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-800"
      >
        <LogoutIcon className="h-5 w-5" />
      </button>
    </header>
  )
}
