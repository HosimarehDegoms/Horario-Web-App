import { supabase } from '../../lib/supabase'
import type { SpotifyConnection } from '../../types/spotify'

interface SpotifyConnectionRow {
  id: string
  user_id: string
  refresh_token: string
  spotify_user_id: string | null
  connected_at: string
}

const SELECT_COLUMNS = 'id, user_id, refresh_token, spotify_user_id, connected_at'

function toConnection(row: SpotifyConnectionRow): SpotifyConnection {
  return {
    id: row.id,
    userId: row.user_id,
    spotifyUserId: row.spotify_user_id ?? undefined,
    connectedAt: row.connected_at,
  }
}

/** Returns the connection (without the refresh token) and the refresh token separately, since most
 * callers only need to know "are we connected", not the secret itself. */
export async function getConnection(): Promise<{ connection: SpotifyConnection; refreshToken: string } | null> {
  const { data, error } = await supabase.from('spotify_connection').select(SELECT_COLUMNS).maybeSingle()

  if (error) {
    throw new Error('Something went wrong while checking your Spotify connection.')
  }
  if (!data) return null

  const row = data as SpotifyConnectionRow
  return { connection: toConnection(row), refreshToken: row.refresh_token }
}

export async function saveConnection(refreshToken: string, spotifyUserId?: string): Promise<SpotifyConnection> {
  const { data, error } = await supabase
    .from('spotify_connection')
    .upsert(
      { refresh_token: refreshToken, spotify_user_id: spotifyUserId ?? null },
      { onConflict: 'user_id' },
    )
    .select(SELECT_COLUMNS)
    .single()

  if (error) {
    throw new Error('Something went wrong while saving your Spotify connection.')
  }

  return toConnection(data as SpotifyConnectionRow)
}

export async function deleteConnection(): Promise<void> {
  const { error } = await supabase.from('spotify_connection').delete().not('id', 'is', null)
  if (error) {
    throw new Error('Something went wrong while disconnecting Spotify.')
  }
}
