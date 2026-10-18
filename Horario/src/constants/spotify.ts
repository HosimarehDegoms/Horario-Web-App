export const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize'
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

export const SPOTIFY_REDIRECT_PATH = '/spotify/callback'

/**
 * streaming + user-read-{email,private} are required by the Web Playback SDK.
 * user-read/modify-playback-state let us show and control what's playing.
 */
export const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ')

export const SPOTIFY_CODE_VERIFIER_STORAGE_KEY = 'horario:spotify-pkce-verifier'

/**
 * Generic search terms (not specific playlist IDs, which can go stale or be
 * region-locked) — we search Spotify's own catalog live and show the top
 * result per term, so suggestions always reflect real, current playlists.
 */
export const LOFI_SEARCH_QUERIES = [
  'Lofi Study Beats',
  'Chill Lofi Hip Hop',
  'Deep Focus Lofi',
  'Lofi Jazz Relax',
  'Lofi Rain Sounds',
  'Lofi Chillhop Radio',
]

/** Quick-pick genre/mood chips for the track search — generic category names, not specific artists or tracks. */
export const STUDY_GENRE_CHIPS = [
  'Lofi',
  'Jazz',
  'Classical',
  'Piano',
  'Ambient',
  'Chillhop',
  'Nature Sounds',
  'Instrumental',
]
