import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import { LoadingState } from '../../../components/ui/LoadingState'
import { addToQueue, getQueue, playTrackNow, searchTracks } from '../../../services/spotify/spotifyApiService'
import { STUDY_GENRE_CHIPS } from '../../../constants/spotify'
import type { SpotifyTrackSummary } from '../../../types/spotify'

interface SpotifySearchPanelProps {
  getAccessToken: () => Promise<string | null>
  deviceId: string | null
  /** The currently-playing track's id (or null) — changes only on an actual track transition, so the queue view refreshes then, not on every position tick. */
  currentTrackId: string | null
}

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function SpotifySearchPanel({ getAccessToken, deviceId, currentTrackId }: SpotifySearchPanelProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SpotifyTrackSummary[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [queue, setQueue] = useState<SpotifyTrackSummary[]>([])
  const [queueOpen, setQueueOpen] = useState(false)
  const [loadingQueue, setLoadingQueue] = useState(false)
  const [queuedTrackId, setQueuedTrackId] = useState<string | null>(null)

  async function runSearch(searchQuery: string) {
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    setSearching(true)
    setError(null)
    try {
      const token = await getAccessToken()
      if (!token) return
      const tracks = await searchTracks(token, trimmed)
      setResults(tracks)
    } catch {
      setError('Search failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void runSearch(query)
  }

  function handleGenreChip(genre: string) {
    setQuery(genre)
    void runSearch(genre)
  }

  async function handlePlayNow(track: SpotifyTrackSummary) {
    if (!deviceId) {
      setError('Still connecting to Spotify — try again in a moment.')
      return
    }
    try {
      const token = await getAccessToken()
      if (!token) return
      await playTrackNow(token, deviceId, track.uri)
    } catch {
      setError('Could not start playback. Make sure Spotify Premium is active on this account.')
    }
  }

  async function handleAddToQueue(track: SpotifyTrackSummary) {
    if (!deviceId) {
      setError('Still connecting to Spotify — try again in a moment.')
      return
    }
    try {
      const token = await getAccessToken()
      if (!token) return
      await addToQueue(token, deviceId, track.uri)
      setQueuedTrackId(track.id)
      setTimeout(() => setQueuedTrackId((current) => (current === track.id ? null : current)), 2000)
      if (queueOpen) void loadQueue()
    } catch {
      setError('Could not add that track to the queue.')
    }
  }

  async function loadQueue() {
    setLoadingQueue(true)
    try {
      const token = await getAccessToken()
      if (!token) return
      const result = await getQueue(token)
      setQueue(result.queue)
    } catch {
      setError('Could not load the queue.')
    } finally {
      setLoadingQueue(false)
    }
  }

  function toggleQueue() {
    const next = !queueOpen
    setQueueOpen(next)
    if (next) void loadQueue()
  }

  useEffect(() => {
    if (queueOpen) void loadQueue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackId])

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          label="Search Spotify"
          hideLabel
          placeholder="Search any song, artist, or genre…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit" disabled={searching}>
          Search
        </Button>
      </form>

      <div className="flex flex-wrap gap-1.5">
        {STUDY_GENRE_CHIPS.map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => handleGenreChip(genre)}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors duration-150 hover:bg-primary-100 hover:text-primary-700"
          >
            {genre}
          </button>
        ))}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {searching ? (
        <LoadingState label="Searching…" />
      ) : results.length > 0 ? (
        <ul className="stagger-list max-h-72 space-y-1.5 overflow-y-auto">
          {results.map((track) => (
            <li
              key={track.id}
              className="flex items-center gap-2.5 rounded-clay-sm border border-slate-200 bg-white p-2 shadow-clay"
            >
              {track.albumImageUrl && (
                <img src={track.albumImageUrl} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-800">{track.name}</p>
                <p className="truncate text-[11px] text-slate-500">{track.artistNames}</p>
              </div>
              <span className="shrink-0 text-[11px] text-slate-400">{formatMs(track.durationMs)}</span>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => void handlePlayNow(track)}
                  title="Play now"
                  className="rounded-full px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50"
                >
                  ▶
                </button>
                <button
                  type="button"
                  onClick={() => void handleAddToQueue(track)}
                  title="Add to queue"
                  className="rounded-full px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100"
                >
                  {queuedTrackId === track.id ? '✓' : '+ Queue'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      <div>
        <button
          type="button"
          onClick={toggleQueue}
          className="text-xs font-medium text-slate-500 hover:text-primary-600"
        >
          {queueOpen ? 'Hide queue' : 'Show up next'}
        </button>
        {queueOpen && (
          <div className="mt-2">
            {loadingQueue ? (
              <LoadingState label="Loading queue…" />
            ) : queue.length === 0 ? (
              <p className="text-xs text-slate-400">Nothing queued yet — add a track above.</p>
            ) : (
              <ul className="space-y-1">
                {queue.map((track, index) => (
                  <li key={`${track.id}-${index}`} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="w-4 shrink-0 text-slate-400">{index + 1}.</span>
                    <span className="truncate">{track.name}</span>
                    <span className="shrink-0 truncate text-slate-400">— {track.artistNames}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-1.5 text-[11px] text-slate-400">
              Spotify's queue order is set by the app itself — tracks can be added to the end here, but not
              reordered or removed individually.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
