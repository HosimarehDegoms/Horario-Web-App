import { supabase } from '../../lib/supabase'
import { DEFAULT_THEME_COLOR_FAMILY, DEFAULT_THEME_FINISH } from '../../constants/themeColors'
import type { SaveThemePreferencesInput, ThemePreferences } from '../../types/themePreferences'

/**
 * Real Supabase-backed theme preferences — one row per user, same shape as
 * timetablePreferencesService (RLS + unique user_id enforce one row;
 * .maybeSingle() so "never saved a theme" comes back as null, not an error).
 */

interface ThemePreferencesRow {
  id: string
  user_id: string
  color_family: ThemePreferences['colorFamily']
  finish: ThemePreferences['finish']
  created_at: string
  updated_at: string
}

const SELECT_COLUMNS = 'id, user_id, color_family, finish, created_at, updated_at'

function toPreferences(row: ThemePreferencesRow): ThemePreferences {
  return {
    id: row.id,
    userId: row.user_id,
    colorFamily: row.color_family,
    finish: row.finish,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getPreferences(): Promise<ThemePreferences | null> {
  const { data, error } = await supabase.from('theme_preferences').select(SELECT_COLUMNS).maybeSingle()

  if (error) {
    throw new Error('Something went wrong while loading your theme. Please try again.')
  }
  if (!data) return null

  return toPreferences(data as ThemePreferencesRow)
}

export async function savePreferences(input: SaveThemePreferencesInput): Promise<ThemePreferences> {
  const { data, error } = await supabase
    .from('theme_preferences')
    .upsert(
      {
        color_family: input.colorFamily,
        finish: input.finish,
      },
      { onConflict: 'user_id' },
    )
    .select(SELECT_COLUMNS)
    .single()

  if (error) {
    throw new Error('Something went wrong while saving your theme. Please try again.')
  }

  return toPreferences(data as ThemePreferencesRow)
}

export const DEFAULT_THEME_PREFERENCES: Pick<ThemePreferences, 'colorFamily' | 'finish'> = {
  colorFamily: DEFAULT_THEME_COLOR_FAMILY,
  finish: DEFAULT_THEME_FINISH,
}
