import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { LoadingState } from '../../components/ui/LoadingState'
import { exchangeCodeForTokens } from '../../services/spotify/spotifyAuthService'
import { getCurrentSpotifyUser } from '../../services/spotify/spotifyApiService'
import * as spotifyConnectionService from '../../services/spotify/spotifyConnectionService'
import { SPOTIFY_CODE_VERIFIER_STORAGE_KEY } from '../../constants/spotify'

type Status = 'working' | 'error'

export function SpotifyCallbackPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('working')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function run() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const deniedReason = params.get('error')
      const verifier = sessionStorage.getItem(SPOTIFY_CODE_VERIFIER_STORAGE_KEY)
      sessionStorage.removeItem(SPOTIFY_CODE_VERIFIER_STORAGE_KEY)

      if (deniedReason) {
        setStatus('error')
        setMessage('Spotify connection was cancelled.')
        return
      }
      if (!code || !verifier) {
        setStatus('error')
        setMessage('Something went wrong starting the Spotify connection. Please try again.')
        return
      }

      try {
        const { tokens, refreshToken } = await exchangeCodeForTokens(code, verifier)
        const spotifyUser = await getCurrentSpotifyUser(tokens.accessToken)
        await spotifyConnectionService.saveConnection(refreshToken, spotifyUser?.id)
        navigate('/focus', { replace: true })
      } catch (err) {
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Could not connect to Spotify. Please try again.')
      }
    }

    void run()
  }, [navigate])

  if (status === 'working') {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <LoadingState label="Connecting to Spotify…" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card title="Couldn't connect Spotify">
        <p className="text-sm text-slate-600">{message}</p>
        <Button type="button" className="mt-4" onClick={() => navigate('/focus')}>
          Back to Focus
        </Button>
      </Card>
    </div>
  )
}
