import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../providers/useAuth'
import { LoadingState } from '../../components/ui/LoadingState'

/** Keeps already-authenticated users off /login and /signup. */
export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <LoadingState label="Checking your session…" />
      </div>
    )
  }

  if (session) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
