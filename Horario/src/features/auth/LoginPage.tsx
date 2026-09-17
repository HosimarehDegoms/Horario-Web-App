import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { LoginForm } from './components/LoginForm'
import * as authService from '../../services/auth/authService'
import type { LoginInput } from '../../types/auth'

export function LoginPage() {
  // No manual navigation after success: PublicOnlyRoute reactively redirects
  // to "/" once AuthProvider's onAuthStateChange picks up the new session.
  async function handleSubmit(input: LoginInput) {
    await authService.login(input)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-indigo-600">Horario</h1>
          <p className="mt-1 text-sm text-slate-500">Log in to your account</p>
        </div>
        <Card>
          <LoginForm onSubmit={handleSubmit} />
        </Card>
        <p className="mt-4 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
