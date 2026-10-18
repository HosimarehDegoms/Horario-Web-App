export interface SpotifyTokens {
  accessToken: string
  /** Epoch ms when accessToken stops being valid. */
  expiresAt: number
}

export interface SpotifyConnection {
  id: string
  userId: string
  spotifyUserId?: string
  connectedAt: string
}

export interface SpotifyPlaylistSummary {
  id: string
  uri: string
  name: string
  description?: string
  imageUrl?: string
  ownerName?: string
  externalUrl?: string
}

export interface SpotifyTrackSummary {
  id: string
  uri: string
  name: string
  artistNames: string
  albumImageUrl?: string
  durationMs: number
}

export interface SpotifyPlaybackState {
  isPaused: boolean
  isActive: boolean
  track: SpotifyTrackSummary | null
  positionMs: number
}
