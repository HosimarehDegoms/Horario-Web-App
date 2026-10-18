import { SPOTIFY_API_BASE } from '../../constants/spotify'
import type { SpotifyPlaylistSummary, SpotifyTrackSummary } from '../../types/spotify'

async function spotifyFetch(accessToken: string, path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${SPOTIFY_API_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, ...(init?.headers ?? {}) },
  })
  if (!response.ok && response.status !== 204) {
    throw new Error(`Spotify request failed (${response.status})`)
  }
  return response
}

interface SpotifySearchPlaylistItem {
  id: string
  uri: string
  name: string
  description: string
  images: { url: string }[]
  owner: { display_name?: string }
  external_urls: { spotify?: string }
}

/** Searches Spotify's catalog live and returns the single best-matching playlist, or null if none. */
export async function searchTopPlaylist(accessToken: string, query: string): Promise<SpotifyPlaylistSummary | null> {
  const params = new URLSearchParams({ q: query, type: 'playlist', limit: '1' })
  const response = await spotifyFetch(accessToken, `/search?${params.toString()}`)
  const payload = await response.json()
  const item = payload?.playlists?.items?.[0] as SpotifySearchPlaylistItem | undefined
  if (!item) return null

  return {
    id: item.id,
    uri: item.uri,
    name: item.name,
    description: item.description || undefined,
    imageUrl: item.images?.[0]?.url,
    ownerName: item.owner?.display_name,
    externalUrl: item.external_urls?.spotify,
  }
}

interface SpotifySearchTrackItem {
  id: string
  uri: string
  name: string
  artists: { name: string }[]
  album: { images: { url: string }[] }
  duration_ms: number
}

function toTrackSummary(item: SpotifySearchTrackItem): SpotifyTrackSummary {
  return {
    id: item.id,
    uri: item.uri,
    name: item.name,
    artistNames: item.artists.map((artist) => artist.name).join(', '),
    albumImageUrl: item.album?.images?.[0]?.url,
    durationMs: item.duration_ms,
  }
}

/** Searches Spotify's catalog for tracks matching a free-text query (song name, artist, or genre). */
export async function searchTracks(accessToken: string, query: string, limit = 12): Promise<SpotifyTrackSummary[]> {
  const params = new URLSearchParams({ q: query, type: 'track', limit: String(limit) })
  const response = await spotifyFetch(accessToken, `/search?${params.toString()}`)
  const payload = await response.json()
  const items = (payload?.tracks?.items ?? []) as SpotifySearchTrackItem[]
  return items.map(toTrackSummary)
}

/** The currently playing track plus the upcoming queue. Spotify's API only supports reading the
 * queue and adding to its end (via addToQueue) — there's no endpoint to reorder or remove a
 * specific queued track, so queue editing is limited to that by the platform itself. */
export async function getQueue(
  accessToken: string,
): Promise<{ currentlyPlaying: SpotifyTrackSummary | null; queue: SpotifyTrackSummary[] }> {
  const response = await spotifyFetch(accessToken, '/me/player/queue')
  const payload = await response.json()
  return {
    currentlyPlaying: payload?.currently_playing ? toTrackSummary(payload.currently_playing) : null,
    queue: ((payload?.queue ?? []) as SpotifySearchTrackItem[]).map(toTrackSummary),
  }
}

export async function addToQueue(accessToken: string, deviceId: string, trackUri: string): Promise<void> {
  const params = new URLSearchParams({ uri: trackUri, device_id: deviceId })
  await spotifyFetch(accessToken, `/me/player/queue?${params.toString()}`, { method: 'POST' })
}

/** Starts playing a single track immediately, replacing whatever's currently playing. */
export async function playTrackNow(accessToken: string, deviceId: string, trackUri: string): Promise<void> {
  await spotifyFetch(accessToken, `/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uris: [trackUri] }),
  })
}

export async function playContext(accessToken: string, deviceId: string, contextUri: string): Promise<void> {
  await spotifyFetch(accessToken, `/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context_uri: contextUri }),
  })
}

export async function pausePlayback(accessToken: string, deviceId: string): Promise<void> {
  await spotifyFetch(accessToken, `/me/player/pause?device_id=${deviceId}`, { method: 'PUT' })
}

export async function resumePlayback(accessToken: string, deviceId: string): Promise<void> {
  await spotifyFetch(accessToken, `/me/player/play?device_id=${deviceId}`, { method: 'PUT' })
}

export async function skipToNext(accessToken: string, deviceId: string): Promise<void> {
  await spotifyFetch(accessToken, `/me/player/next?device_id=${deviceId}`, { method: 'POST' })
}

export async function setVolume(accessToken: string, deviceId: string, percent: number): Promise<void> {
  await spotifyFetch(accessToken, `/me/player/volume?volume_percent=${Math.round(percent)}&device_id=${deviceId}`, {
    method: 'PUT',
  })
}

export async function getCurrentSpotifyUser(accessToken: string): Promise<{ id: string } | null> {
  const response = await spotifyFetch(accessToken, '/me')
  const payload = await response.json()
  return payload?.id ? { id: payload.id } : null
}
