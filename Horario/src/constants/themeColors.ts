import type { MascotAccessory, MascotBodyShape } from '../components/illustrations/Mascot'
import type { ThemeColorFamily, ThemeFinish } from '../types/themePreferences'

export type ColorScale = Record<'50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900', string>

/** Standard, well-established color ramps — one full 50-900 scale per family. */
export const THEME_COLOR_SCALES: Record<ThemeColorFamily, ColorScale> = {
  indigo: {
    '50': '#eef2ff',
    '100': '#e0e7ff',
    '200': '#c7d2fe',
    '300': '#a5b4fc',
    '400': '#818cf8',
    '500': '#6366f1',
    '600': '#4f46e5',
    '700': '#4338ca',
    '800': '#3730a3',
    '900': '#312e81',
  },
  violet: {
    '50': '#f5f3ff',
    '100': '#ede9fe',
    '200': '#ddd6fe',
    '300': '#c4b5fd',
    '400': '#a78bfa',
    '500': '#8b5cf6',
    '600': '#7c3aed',
    '700': '#6d28d9',
    '800': '#5b21b6',
    '900': '#4c1d95',
  },
  teal: {
    '50': '#f0fdfa',
    '100': '#ccfbf1',
    '200': '#99f6e4',
    '300': '#5eead4',
    '400': '#2dd4bf',
    '500': '#14b8a6',
    '600': '#0d9488',
    '700': '#0f766e',
    '800': '#115e59',
    '900': '#134e4a',
  },
  rose: {
    '50': '#fff1f2',
    '100': '#ffe4e6',
    '200': '#fecdd3',
    '300': '#fda4af',
    '400': '#fb7185',
    '500': '#f43f5e',
    '600': '#e11d48',
    '700': '#be123c',
    '800': '#9f1239',
    '900': '#881337',
  },
  sky: {
    '50': '#f0f9ff',
    '100': '#e0f2fe',
    '200': '#bae6fd',
    '300': '#7dd3fc',
    '400': '#38bdf8',
    '500': '#0ea5e9',
    '600': '#0284c7',
    '700': '#0369a1',
    '800': '#075985',
    '900': '#0c4a6e',
  },
  emerald: {
    '50': '#ecfdf5',
    '100': '#d1fae5',
    '200': '#a7f3d0',
    '300': '#6ee7b7',
    '400': '#34d399',
    '500': '#10b981',
    '600': '#059669',
    '700': '#047857',
    '800': '#065f46',
    '900': '#064e3b',
  },
  amber: {
    '50': '#fffbeb',
    '100': '#fef3c7',
    '200': '#fde68a',
    '300': '#fcd34d',
    '400': '#fbbf24',
    '500': '#f59e0b',
    '600': '#d97706',
    '700': '#b45309',
    '800': '#92400e',
    '900': '#78350f',
  },
  slate: {
    '50': '#f8fafc',
    '100': '#f1f5f9',
    '200': '#e2e8f0',
    '300': '#cbd5e1',
    '400': '#94a3b8',
    '500': '#64748b',
    '600': '#475569',
    '700': '#334155',
    '800': '#1e293b',
    '900': '#0f172a',
  },
  fuchsia: {
    '50': '#fdf4ff',
    '100': '#fae8ff',
    '200': '#f5d0fe',
    '300': '#f0abfc',
    '400': '#e879f9',
    '500': '#d946ef',
    '600': '#c026d3',
    '700': '#a21caf',
    '800': '#86198f',
    '900': '#701a75',
  },
  orange: {
    '50': '#fff7ed',
    '100': '#ffedd5',
    '200': '#fed7aa',
    '300': '#fdba74',
    '400': '#fb923c',
    '500': '#f97316',
    '600': '#ea580c',
    '700': '#c2410c',
    '800': '#9a3412',
    '900': '#7c2d12',
  },
}

export const THEME_COLOR_FAMILY_ORDER: ThemeColorFamily[] = [
  'indigo',
  'violet',
  'teal',
  'rose',
  'sky',
  'emerald',
  'amber',
  'slate',
  'fuchsia',
  'orange',
]

export const THEME_COLOR_FAMILY_LABELS: Record<ThemeColorFamily, string> = {
  indigo: 'Indigo',
  violet: 'Violet',
  teal: 'Teal',
  rose: 'Rose',
  sky: 'Sky',
  emerald: 'Emerald',
  amber: 'Amber',
  slate: 'Slate',
  fuchsia: 'Fuchsia',
  orange: 'Orange',
}

export const THEME_FINISH_ORDER: ThemeFinish[] = ['solid', 'gradient', 'matte', 'metallic']

export const THEME_FINISH_LABELS: Record<ThemeFinish, string> = {
  solid: 'Solid',
  gradient: 'Gradient',
  matte: 'Matte',
  metallic: 'Metallic',
}

export const THEME_FINISH_DESCRIPTIONS: Record<ThemeFinish, string> = {
  solid: 'Flat, confident color.',
  gradient: 'Smooth two-tone blend.',
  matte: 'Muted, low-gloss flat tone.',
  metallic: 'Gradient with a reflective sheen.',
}

export const DEFAULT_THEME_COLOR_FAMILY: ThemeColorFamily = 'indigo'
export const DEFAULT_THEME_FINISH: ThemeFinish = 'gradient'

export type ThemeBackgroundMotif = 'none' | 'wave' | 'leaf' | 'paw' | 'bone' | 'scribble' | 'sparkle' | 'cloud'

export interface ThemePreset {
  id: string
  label: string
  emoji: string
  colorFamily: ThemeColorFamily
  finish: ThemeFinish
  characterAccessory: MascotAccessory
  bodyShape: MascotBodyShape
  backgroundMotif: ThemeBackgroundMotif
}

/**
 * Curated named themes — each is just a thoughtfully-chosen pairing of an
 * existing color family + finish, so picking one is a shortcut into the same
 * underlying engine as the manual pickers below (not a separate system).
 * Deliberately original/generic concepts only (cat, dog, forest, ocean,
 * doodle, pink/fairytale) — no themes are named after or styled to mimic a
 * specific copyrighted character or franchise.
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'classic',
    label: 'Classic',
    emoji: '💜',
    colorFamily: 'indigo',
    finish: 'gradient',
    characterAccessory: 'none',
    bodyShape: 'blob',
    backgroundMotif: 'none',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    emoji: '🌊',
    colorFamily: 'sky',
    finish: 'gradient',
    characterAccessory: 'wave',
    bodyShape: 'blob',
    backgroundMotif: 'wave',
  },
  {
    id: 'forest',
    label: 'Forest',
    emoji: '🌲',
    colorFamily: 'emerald',
    finish: 'matte',
    characterAccessory: 'leaf',
    bodyShape: 'blob',
    backgroundMotif: 'leaf',
  },
  {
    id: 'cozy_cat',
    label: 'Cozy Cat',
    emoji: '🐾',
    colorFamily: 'amber',
    finish: 'gradient',
    characterAccessory: 'none',
    bodyShape: 'cat',
    backgroundMotif: 'paw',
  },
  {
    id: 'sunny_pup',
    label: 'Sunny Pup',
    emoji: '🐶',
    colorFamily: 'orange',
    finish: 'solid',
    characterAccessory: 'none',
    bodyShape: 'dog',
    backgroundMotif: 'bone',
  },
  {
    id: 'doodle_pop',
    label: 'Doodle Pop',
    emoji: '✏️',
    colorFamily: 'fuchsia',
    finish: 'gradient',
    characterAccessory: 'scribble',
    bodyShape: 'blob',
    backgroundMotif: 'scribble',
  },
  {
    id: 'fairytale_pink',
    label: 'Fairytale Pink',
    emoji: '👑',
    colorFamily: 'rose',
    finish: 'metallic',
    characterAccessory: 'crown',
    bodyShape: 'blob',
    backgroundMotif: 'sparkle',
  },
  {
    id: 'cloud_dream',
    label: 'Cloud Dream',
    emoji: '☁️',
    colorFamily: 'violet',
    finish: 'matte',
    characterAccessory: 'cloud-puff',
    bodyShape: 'blob',
    backgroundMotif: 'cloud',
  },
]

/** Finds the preset matching the given color+finish combo, if any (manual custom combos return undefined). */
export function findThemePreset(colorFamily: ThemeColorFamily, finish: ThemeFinish): ThemePreset | undefined {
  return THEME_PRESETS.find((preset) => preset.colorFamily === colorFamily && preset.finish === finish)
}
