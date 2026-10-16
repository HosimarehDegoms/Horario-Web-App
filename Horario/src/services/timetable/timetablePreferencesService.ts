import { supabase } from '../../lib/supabase'
import { BACKGROUND_IMAGE_BUCKET } from '../../constants/backgroundUpload'
import type { SaveTimetablePreferencesInput, TimetablePreferences } from '../../types/timetablePreferences'

/**
 * Real Supabase-backed preferences layer. One row per user (RLS + the
 * unique `user_id` constraint enforce this), fetched with `.maybeSingle()`
 * so "no preferences saved yet" comes back as `null` rather than an error —
 * that's what tells the UI to show the "Create a Schedule" entry point.
 */

interface TimetablePreferencesRow {
  id: string
  user_id: string
  template: TimetablePreferences['template']
  background_image_url: string | null
  created_at: string
  updated_at: string
}

const SELECT_COLUMNS = 'id, user_id, template, background_image_url, created_at, updated_at'

function toPreferences(row: TimetablePreferencesRow): TimetablePreferences {
  return {
    id: row.id,
    userId: row.user_id,
    template: row.template,
    backgroundImageUrl: row.background_image_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getPreferences(): Promise<TimetablePreferences | null> {
  const { data, error } = await supabase.from('timetable_preferences').select(SELECT_COLUMNS).maybeSingle()

  if (error) {
    throw new Error('Something went wrong while loading your schedule design. Please try again.')
  }
  if (!data) return null

  return toPreferences(data as TimetablePreferencesRow)
}

export async function savePreferences(input: SaveTimetablePreferencesInput): Promise<TimetablePreferences> {
  const { data, error } = await supabase
    .from('timetable_preferences')
    .upsert(
      {
        template: input.template,
        background_image_url: input.backgroundImageUrl ?? null,
      },
      { onConflict: 'user_id' },
    )
    .select(SELECT_COLUMNS)
    .single()

  if (error) {
    throw new Error('Something went wrong while saving your schedule design. Please try again.')
  }

  return toPreferences(data as TimetablePreferencesRow)
}

export async function uploadBackgroundImage(file: File): Promise<string> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData.user) {
    throw new Error('You must be logged in to upload a background.')
  }

  const extension = file.name.split('.').pop() ?? 'jpg'
  const path = `${userData.user.id}/background-${Date.now()}.${extension}`

  const { error: uploadError } = await supabase.storage
    .from(BACKGROUND_IMAGE_BUCKET)
    .upload(path, file, { upsert: true, cacheControl: '3600' })

  if (uploadError) {
    throw new Error('Something went wrong while uploading your background. Please try again.')
  }

  const { data: publicUrlData } = supabase.storage.from(BACKGROUND_IMAGE_BUCKET).getPublicUrl(path)
  return publicUrlData.publicUrl
}
