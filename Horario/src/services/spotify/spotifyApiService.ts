import { SPOTIFY_API_BASE } from '../../constants/spotify'
import type { SpotifyPlaylistSummary } from '../../types/spotify'

async function spotifyFetch(accessToken: string, path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${SPOTIFY_API_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, ...(init?.headers ?? {}) },
  })
  if (!response.ok && response.status !== 204) {
    const body = await response.text().catch(() => '')
    let detail = body
    try {
      const parsed = JSON.parse(body)
      detail = parsed?.error?.message || parsed?.error_description || body
    } catch {
      // body wasn't JSON; use it as-is
    }
    throw new Error(`Spotify request failed (${response.status}): ${String(detail).slice(0, 200)}`)
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
