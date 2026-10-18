import { useEffect, useState } from 'react'
import { Button } from '../../../components/ui/Button'
import { LoadingState } from '../../../components/ui/LoadingState'
import { useSpotifyConnection } from '../../../hooks/useSpotifyConnection'
import { useSpotifyPlayer } from '../../../hooks/useSpotifyPlayer'
import { searchTopPlaylist, pausePlayback, playContext, resumePlayback, skipToNext } from '../../../services/spotify/spotifyApiService'
import { SpotifySearchPanel } from './SpotifySearchPanel'
import { LOFI_SEARCH_QUERIES } from '../../../constants/spotify'
import type { SpotifyPlaylistSummary } from '../../../types/spotify'

/**
 * A generic music-note glyph, not Spotify's own logo mark — avoids
 * reproducing their trademarked brand asset from a hand-drawn approximation.
 * The brand green + the word "Spotify" in text are what actually identify
 * the service here.
 */
function MusicNoteIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={props.className} fill="none" stroke="#1DB954" strokeWidth="1.8" aria-hidden="true">
      <circle cx="7" cy="18" r="2.5" />
      <circle cx="17" cy="16" r="2.5" />
      <path d="M9.5 18V6.5L19.5 4v11.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function SpotifyMusicPanel() {
  const spotify = useSpotifyConnection()
  const isConnected = Boolean(spotify.connection)
  const player = useSpotifyPlayer(spotify.getAccessToken, isConnected)

  const [playlists, setPlaylists] = useState<SpotifyPlaylistSummary[]>([])
  const [loadingPlaylists, setLoadingPlaylists] = useState(false)
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected) return
    let cancelled = false

    async function loadSuggestions() {
      setLoadingPlaylists(true)
      try {
        const token = await spotify.getAccessToken()
        if (!token) return
        const results = await Promise.all(
          LOFI_SEARCH_QUERIES.map((query) => searchTopPlaylist(token, query).catch(() => null)),
        )
        if (!cancelled) {
          setPlaylists(results.filter((playlist): playlist is SpotifyPlaylistSummary => playlist !== null))
        }
      } finally {
        if (!cancelled) setLoadingPlaylists(false)
      }
    }

    void loadSuggestions()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected])

  async function handlePlay(playlist: SpotifyPlaylistSummary) {
    setActionError(null)
    if (!player.deviceId) {
      setActionError('Still connecting to Spotify — try again in a moment.')
      return
    }
    try {
      const token = await spotify.getAccessToken()
      if (!token) return
      await playContext(token, player.deviceId, playlist.uri)
      setActivePlaylistId(playlist.id)
    } catch {
      setActionError('Could not start playback. Make sure Spotify Premium is active on this account.')
    }
  }

  async function handlePauseResume() {
    const token = await spotify.getAccessToken()
    if (!token || !player.deviceId) return
    if (player.playback.isPaused) {
      await resumePlayback(token, player.deviceId)
    } else {
      await pausePlayback(token, player.deviceId)
    }
  }

  async function handleSkip() {
    const token = await spotify.getAccessToken()
    if (!token || !player.deviceId) return
    await skipToNext(token, player.deviceId)
  }

  if (spotify.loading) {
    return <LoadingState label="Checking Spotify connection…" />
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <MusicNoteIcon className="h-8 w-8" />
        <p className="text-sm text-slate-600">
          Connect Spotify to play relaxing lofi music while you focus — requires Spotify Premium.
        </p>
        <Button type="button" variant="secondary" onClick={() => void spotify.connect()}>
          Connect to Spotify
        </Button>
        {spotify.error && <p className="text-xs text-red-600">{spotify.error}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <MusicNoteIcon className="h-5 w-5" />
          Connected to Spotify
        </div>
        <button
          type="button"
          onClick={() => void spotify.disconnect()}
          className="text-xs font-medium text-slate-400 hover:text-red-600"
        >
          Disconnect
        </button>
      </div>

      {player.error && <p className="text-xs text-red-600">{player.error}</p>}
      {actionError && <p className="text-xs text-red-600">{actionError}</p>}

      {player.playback.track && (
        <div className="flex items-center gap-3 rounded-clay-sm border border-white/60 bg-white p-3 shadow-clay">
          {player.playback.track.albumImageUrl && (
            <img
              src={player.playback.track.albumImageUrl}
              alt=""
              className="h-12 w-12 shrink-0 rounded-md object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">{player.playback.track.name}</p>
            <p className="truncate text-xs text-slate-500">{player.playback.track.artistNames}</p>
          </div>
          <span className="shrink-0 text-xs text-slate-400">{formatMs(player.playback.positionMs)}</span>
          <div className="flex shrink-0 gap-1">
            <Button type="button" variant="secondary" onClick={() => void handlePauseResume()}>
              {player.playback.isPaused ? '▶' : '⏸'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => void handleSkip()}>
              ⏭
            </Button>
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Lofi, for studying</p>
        {loadingPlaylists ? (
          <LoadingState label="Finding lofi playlists…" />
        ) : (
          <ul className="stagger-list grid gap-2 sm:grid-cols-2">
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <button
                  type="button"
                  onClick={() => void handlePlay(playlist)}
                  className={`flex w-full items-center gap-3 rounded-clay-sm border p-2.5 text-left transition-[transform,box-shadow] duration-150 ease-clay hover:-translate-y-0.5 ${
                    activePlaylistId === playlist.id
                      ? 'border-slate-900 shadow-clay-hover'
                      : 'border-slate-200 shadow-clay'
                  }`}
                >
                  {playlist.imageUrl && (
                    <img src={playlist.imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800">{playlist.name}</p>
                    {playlist.ownerName && <p className="truncate text-[11px] text-slate-500">{playlist.ownerName}</p>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <p className="mb-2 text-sm font-medium text-slate-700">Search for any song, artist, or genre</p>
        <SpotifySearchPanel
          getAccessToken={spotify.getAccessToken}
          deviceId={player.deviceId}
          currentTrackId={player.playback.track?.id ?? null}
        />
      </div>
    </div>
  )
}
