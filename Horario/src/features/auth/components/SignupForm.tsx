import { useState } from 'react'
import type { FormEvent } from 'react'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import type { SignUpInput } from '../../../types/auth'

const GMAIL_PATTERN = /^[^\s@]+@gmail\.com$/i
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/

interface SignupFormProps {
  onSubmit: (input: SignUpInput) => Promise<void>
}

interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  function validate(): FormErrors {
    const nextErrors: FormErrors = {}
    if (!USERNAME_PATTERN.test(username.trim())) {
      nextErrors.username = 'Username must be 3-20 characters (letters, numbers, underscore only).'
    }
    if (!GMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Please use a Gmail address (e.g. you@gmail.com).'
    }
    if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }
    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setSubmitError(null)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try {
      await onSubmit({ username: username.trim(), email: email.trim(), password })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="alex"
          autoComplete="username"
        />
        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
      </div>
      <div>
        <Input
          label="Gmail address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@gmail.com"
          autoComplete="email"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      <div>
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>
      <div>
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <Button type="submit" className="w-full justify-center" disabled={submitting}>
        {submitting ? 'Creating account…' : 'Sign Up'}
      </Button>
    </form>
  )
}
