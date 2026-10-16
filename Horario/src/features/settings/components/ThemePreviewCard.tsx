import { useMemo } from 'react'
import { THEME_COLOR_SCALES } from '../../../constants/themeColors'
import type { ThemeColorFamily, ThemeFinish } from '../../../types/themePreferences'

interface ThemePreviewCardProps {
  colorFamily: ThemeColorFamily
  finish: ThemeFinish
}

/**
 * A self-contained "fake mini app screen" previewing a candidate theme —
 * scoped to this element via inline CSS custom properties, so picking a
 * color/finish here never touches the real, currently-applied app theme.
 * Only Apply (in the parent page) calls applyThemeToRoot + saves.
 */
export function ThemePreviewCard({ colorFamily, finish }: ThemePreviewCardProps) {
  const scaleVars = useMemo(() => {
    const scale = THEME_COLOR_SCALES[colorFamily]
    const vars: Record<string, string> = {}
    for (const [shade, hex] of Object.entries(scale)) {
      vars[`--color-primary-${shade}`] = hex
    }
    return vars
  }, [colorFamily])

  return (
    <div
      data-theme-finish={finish}
      style={scaleVars as React.CSSProperties}
      className="overflow-hidden rounded-clay-lg border border-slate-200 bg-white shadow-clay"
    >
      <div className="theme-surface flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm font-semibold">Horario</span>
        <span className="h-6 w-6 rounded-full bg-white/30" />
      </div>
      <div className="space-y-3 bg-gradient-to-br from-primary-50 via-white to-white p-4">
        <div className="rounded-clay-sm border border-white/60 bg-white p-3 shadow-clay">
          <p className="text-xs font-medium text-slate-500">Today</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">Mathematics · 9:00 AM</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="theme-surface rounded-full px-3 py-1.5 text-xs font-semibold text-white">Add Task</span>
          <span className="rounded-full bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-700">
            Badge
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="theme-surface h-full w-2/3" />
        </div>
      </div>
    </div>
  )
}
