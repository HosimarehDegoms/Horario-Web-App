import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import { getProfile } from '../../services/auth/authService'
import { AuthContext } from './AuthContext'
import type { Profile } from '../../types/auth'

/**
 * The single shared source of truth for auth state. Unlike useTasks/useSchedules
 * (where each page calling the hook independently happens to work because pages
 * fully remount on navigation), auth state must be instantly consistent
 * everywhere at once — logging out must immediately hide the whole app, not
 * wait for a remount. Hence a Context provider rather than a plain hook.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const result = await getProfile(userId)
      setProfile(result)
    } catch {
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      const { data } = await supabase.auth.getSession()
      if (cancelled) return

      setSession(data.session)
      if (data.session) {
        await loadProfile(data.session.user.id)
      }
      if (!cancelled) setLoading(false)
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (nextSession) {
        void loadProfile(nextSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [loadProfile])

  const refreshProfile = useCallback(async () => {
    if (session) await loadProfile(session.user.id)
  }, [session, loadProfile])

  return (
    <AuthContext.Provider value={{ session, profile, loading, refreshProfile }}>{children}</AuthContext.Provider>
  )
}
