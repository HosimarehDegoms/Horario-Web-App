import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Mascot } from '../../components/illustrations/Mascot'
import { SignupForm } from './components/SignupForm'
import * as authService from '../../services/auth/authService'
import type { SignUpInput } from '../../types/auth'

export function SignupPage() {
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false)

  async function handleSubmit(input: SignUpInput) {
    const result = await authService.signUp(input)
    if (!result.session) {
      setNeedsEmailConfirmation(true)
    }
    // If a session WAS created, PublicOnlyRoute reactively redirects to "/"
    // once AuthProvider's onAuthStateChange picks it up — no manual navigate.
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-4 text-center">
          <Mascot
            variant={needsEmailConfirmation ? 'celebrate' : 'welcome'}
            className="mx-auto h-32 w-32 sm:h-36 sm:w-36"
          />
        </div>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-primary-600">Horario</h1>
          <p className="mt-1 text-sm text-slate-500">Create your account</p>
        </div>
        <Card>
          {needsEmailConfirmation ? (
            <div className="text-center">
              <p className="text-sm font-medium text-slate-900">Check your email</p>
              <p className="mt-1 text-sm text-slate-500">
                We sent a confirmation link to your Gmail address. Confirm it, then log in.
              </p>
              <Link to="/login" className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline">
                Go to login
              </Link>
            </div>
          ) : (
            <SignupForm onSubmit={handleSubmit} />
          )}
        </Card>
        {!needsEmailConfirmation && (
          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:underline">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
