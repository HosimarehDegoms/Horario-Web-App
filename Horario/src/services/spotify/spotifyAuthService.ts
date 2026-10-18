import { SPOTIFY_REDIRECT_PATH, SPOTIFY_TOKEN_URL } from '../../constants/spotify'
import type { SpotifyTokens } from '../../types/spotify'

function getClientId(): string {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  if (!clientId) {
    throw new Error('Spotify is not configured for this app yet (missing VITE_SPOTIFY_CLIENT_ID).')
  }
  return clientId
}

export function getRedirectUri(): string {
  return `${window.location.origin}${SPOTIFY_REDIRECT_PATH}`
}

interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
}

function toTokens(payload: TokenResponse): SpotifyTokens {
  return {
    accessToken: payload.access_token,
    expiresAt: Date.now() + payload.expires_in * 1000,
  }
}

export async function exchangeCodeForTokens(
  code: string,
  codeVerifier: string,
): Promise<{ tokens: SpotifyTokens; refreshToken: string }> {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: getClientId(),
      grant_type: 'authorization_code',
      code,
      redirect_uri: getRedirectUri(),
      code_verifier: codeVerifier,
    }),
  })

  if (!response.ok) {
    throw new Error('Could not connect to Spotify. Please try again.')
  }

  const payload = (await response.json()) as TokenResponse
  if (!payload.refresh_token) {
    throw new Error('Spotify did not return a refresh token. Please try connecting again.')
  }

  return { tokens: toTokens(payload), refreshToken: payload.refresh_token }
}

export async function refreshAccessToken(refreshToken: string): Promise<SpotifyTokens> {
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: getClientId(),
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error('Your Spotify connection expired. Please reconnect.')
  }

  const payload = (await response.json()) as TokenResponse
  return toTokens(payload)
}

export { getClientId }
