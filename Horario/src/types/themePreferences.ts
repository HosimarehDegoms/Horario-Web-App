export type ThemeColorFamily =
  | 'indigo'
  | 'violet'
  | 'teal'
  | 'rose'
  | 'sky'
  | 'emerald'
  | 'amber'
  | 'slate'
  | 'fuchsia'
  | 'orange'

export type ThemeFinish = 'solid' | 'gradient' | 'matte' | 'metallic'

export interface ThemePreferences {
  id: string
  userId: string
  colorFamily: ThemeColorFamily
  finish: ThemeFinish
  createdAt: string
  updatedAt: string
}

export interface SaveThemePreferencesInput {
  colorFamily: ThemeColorFamily
  finish: ThemeFinish
}
