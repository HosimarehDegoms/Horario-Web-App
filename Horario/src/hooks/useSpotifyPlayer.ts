import { useEffect, useRef, useState } from 'react'
import type { SpotifyPlaybackState } from '../types/spotify'

// Minimal shape of the Web Playback SDK's window.Spotify global — the full SDK ships its own types,
// but it's loaded dynamically via script tag, not as an npm package, so we declare just what we use.
interface SpotifyPlayerInstance {
  connect(): Promise<boolean>
  disconnect(): void
  addListener(event: string, callback: (data: unknown) => void): void
}
interface SpotifySdk {
  Player: new (options: {
    name: string
    getOAuthToken: (cb: (token: string) => void) => void
    volume: number
  }) => SpotifyPlayerInstance
}
declare global {
  interface Window {
    Spotify?: SpotifySdk
    onSpotifyWebPlaybackSDKReady?: () => void
  }
}

const SDK_SCRIPT_SRC = 'https://sdk.scdn.co/spotify-player.js'
const SDK_LOAD_TIMEOUT_MS = 10_000
let sdkLoadPromise: Promise<void> | null = null

/**
 * Facebook/Messenger/Instagram/Line/WeChat in-app browsers wrap a stripped-down WebView that
 * blocks the EME (DRM) APIs the Web Playback SDK needs to play audio. On those, the SDK script
 * can load but then hang indefinitely instead of ever calling back — which otherwise leaves the
 * caller `await`-ing a promise that never resolves. Detect that case up front and refuse to try.
 */
function isSpotifyPlaybackSupported(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|WhatsApp/i.test(ua)) return false
  return 'requestMediaKeySystemAccess' in navigator
}

function loadSdk(): Promise<void> {
  if (window.Spotify) return Promise.resolve()
  if (sdkLoadPromise) return sdkLoadPromise

  sdkLoadPromise = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Spotify SDK did not become ready in time.')), SDK_LOAD_TIMEOUT_MS)
    window.onSpotifyWebPlaybackSDKReady = () => {
      clearTimeout(timeout)
      resolve()
    }
    const script = document.createElement('script')
    script.src = SDK_SCRIPT_SRC
    script.async = true
    script.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('Spotify SDK script failed to load.'))
    }
    document.body.appendChild(script)
  }).catch((err) => {
    // Let the next connection attempt retry instead of staying rejected forever.
    sdkLoadPromise = null
    throw err
  })
  return sdkLoadPromise
}

interface UseSpotifyPlayerResult {
  ready: boolean
  deviceId: string | null
  playback: SpotifyPlaybackState
  error: string | null
}

/** Mounts a Horario device in the user's Spotify Connect device list, playable via the Web API. */
export function useSpotifyPlayer(getAccessToken: () => Promise<string | null>, enabled: boolean): UseSpotifyPlayerResult {
  const [ready, setReady] = useState(false)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [playback, setPlayback] = useState<SpotifyPlaybackState>({ isPaused: true, isActive: false, track: null, positionMs: 0 })
  const [error, setError] = useState<string | null>(null)
  const playerRef = useRef<SpotifyPlayerInstance | null>(null)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    async function setup() {
      if (!isSpotifyPlaybackSupported()) {
        if (!cancelled) {
          setError('Spotify playback needs a full browser (Safari/Chrome) — it can\'t run inside an in-app browser like Messenger or Instagram.')
        }
        return
      }

      try {
        await loadSdk()
      } catch {
        if (!cancelled) setError('Could not load the Spotify player. Please try again in Safari or Chrome.')
        return
      }
      if (cancelled || !window.Spotify) return

      let player: SpotifyPlayerInstance
      try {
        player = new window.Spotify.Player({
          name: 'Horario Focus Player',
          getOAuthToken: (callback) => {
            void getAccessToken().then((token) => {
              if (token) callback(token)
            })
          },
          volume: 0.6,
        })
      } catch {
        if (!cancelled) setError('Could not start the Spotify player in this browser.')
        return
      }

      player.addListener('ready', (data) => {
        const { device_id } = data as { device_id: string }
        if (!cancelled) {
          setDeviceId(device_id)
          setReady(true)
        }
      })

      player.addListener('not_ready', () => {
        if (!cancelled) setReady(false)
      })

      player.addListener('initialization_error', () => {
        if (!cancelled) setError('Could not start the Spotify player in this browser.')
      })
      player.addListener('authentication_error', () => {
        if (!cancelled) setError('Your Spotify session expired. Please reconnect.')
      })
      player.addListener('account_error', () => {
        if (!cancelled) setError('Playback requires a Spotify Premium account.')
      })

      player.addListener('player_state_changed', (data) => {
        if (cancelled || !data) return
        const state = data as {
          paused: boolean
          position: number
          track_window: { current_track: { id: string; uri: string; name: string; artists: { name: string }[]; album: { images: { url: string }[] }; duration_ms: number } | null }
        }
        const current = state.track_window?.current_track
        setPlayback({
          isPaused: state.paused,
          isActive: true,
          positionMs: state.position,
          track: current
            ? {
                id: current.id,
                uri: current.uri,
                name: current.name,
                artistNames: current.artists.map((artist) => artist.name).join(', '),
                albumImageUrl: current.album?.images?.[0]?.url,
                durationMs: current.duration_ms,
              }
            : null,
        })
      })

      try {
        await player.connect()
        playerRef.current = player
      } catch {
        if (!cancelled) setError('Could not start the Spotify player in this browser.')
      }
    }

    void setup()

    return () => {
      cancelled = true
      playerRef.current?.disconnect()
      playerRef.current = null
      setReady(false)
      setDeviceId(null)
    }
  }, [enabled, getAccessToken])

  return { ready, deviceId, playback, error }
}
