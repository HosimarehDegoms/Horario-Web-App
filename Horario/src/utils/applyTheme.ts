import { THEME_COLOR_SCALES } from '../constants/themeColors'
import type { ThemeColorFamily, ThemeFinish } from '../types/themePreferences'

/**
 * Overrides the --color-primary-* custom properties (and data-theme-finish)
 * on a given element. Works for both the real global theme (applied to
 * document.documentElement) and a scoped live preview (applied to a small
 * container div) — CSS custom properties cascade to descendants either way,
 * and every Tailwind utility in this app reads --color-primary-* via var(),
 * so this re-themes everything under the target element with no rebuild.
 */
export function applyThemeToElement(element: HTMLElement, colorFamily: ThemeColorFamily, finish: ThemeFinish): void {
  const scale = THEME_COLOR_SCALES[colorFamily]
  for (const [shade, hex] of Object.entries(scale)) {
    element.style.setProperty(`--color-primary-${shade}`, hex)
  }
  element.setAttribute('data-theme-finish', finish)
}

export function applyThemeToRoot(colorFamily: ThemeColorFamily, finish: ThemeFinish): void {
  applyThemeToElement(document.documentElement, colorFamily, finish)
}
