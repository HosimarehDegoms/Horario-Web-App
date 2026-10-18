import { useCallback, useEffect, useRef, useState } from 'react'
import * as spotifyConnectionService from '../services/spotify/spotifyConnectionService'
import { getRedirectUri, refreshAccessToken } from '../services/spotify/spotifyAuthService'
import { generateCodeChallenge, generateCodeVerifier } from '../utils/spotifyPkce'
import { SPOTIFY_AUTHORIZE_URL, SPOTIFY_CODE_VERIFIER_STORAGE_KEY, SPOTIFY_SCOPES } from '../constants/spotify'
import type { SpotifyConnection, SpotifyTokens } from '../types/spotify'

interface UseSpotifyConnectionResult {
  connection: SpotifyConnection | null
  loading: boolean
  error: string | null
  /** Resolves to a currently-valid access token, refreshing first if needed. Null if not connected. */
  getAccessToken: () => Promise<string | null>
  /** Redirects the browser to Spotify's login/consent screen. */
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  refetch: () => void
}

export function useSpotifyConnection(): UseSpotifyConnectionResult {
  const [connection, setConnection] = useState<SpotifyConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const refreshTokenRef = useRef<string | null>(null)
  const tokensRef = useRef<SpotifyTokens | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await spotifyConnectionService.getConnection()
        if (cancelled) return
        setConnection(result?.connection ?? null)
        refreshTokenRef.current = result?.refreshToken ?? null
        tokensRef.current = null
      } catch {
        if (!cancelled) setError('Something went wrong while checking your Spotify connection.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const refreshToken = refreshTokenRef.current
    if (!refreshToken) return null

    const cached = tokensRef.current
    if (cached && cached.expiresAt - Date.now() > 30_000) {
      return cached.accessToken
    }

    const fresh = await refreshAccessToken(refreshToken)
    tokensRef.current = fresh
    return fresh.accessToken
  }, [])

  const connect = useCallback(async () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
    if (!clientId) {
      setError('Spotify is not configured for this app yet.')
      return
    }

    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    sessionStorage.setItem(SPOTIFY_CODE_VERIFIER_STORAGE_KEY, verifier)

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: SPOTIFY_SCOPES,
      redirect_uri: getRedirectUri(),
      code_challenge_method: 'S256',
      code_challenge: challenge,
    })
    window.location.href = `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`
  }, [])

  const disconnect = useCallback(async () => {
    await spotifyConnectionService.deleteConnection()
    refreshTokenRef.current = null
    tokensRef.current = null
    setConnection(null)
  }, [])

  const refetch = useCallback(() => setReloadToken((token) => token + 1), [])

  return { connection, loading, error, getAccessToken, connect, disconnect, refetch }
}
