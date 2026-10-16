import { useContext } from 'react'
import { ActiveThemeContext } from './activeThemeContext'
import type { ThemePreset } from '../../constants/themeColors'

export function useActiveThemePreset(): ThemePreset | null {
  return useContext(ActiveThemeContext)
}
