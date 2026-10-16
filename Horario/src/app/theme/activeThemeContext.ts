import { createContext } from 'react'
import type { ThemePreset } from '../../constants/themeColors'

/**
 * The currently-applied theme preset (if the active color+finish combo
 * matches one), so Mascot and other components can pick up a themed look
 * without prop-drilling. null outside AppLayout (e.g. Login/Signup) or when
 * the user has mixed a custom color+finish that doesn't match any preset.
 */
export const ActiveThemeContext = createContext<ThemePreset | null>(null)
