import { supabase } from '../../lib/supabase'
import type { LoginInput, Profile, SignUpInput, SignUpResult } from '../../types/auth'

/**
 * Best-effort mapping from Supabase/Postgres error text to something a user
 * can act on. The exact string GoTrue returns when the handle_new_user
 * trigger rejects a duplicate username (see the SQL migration) hasn't been
 * observed against a live project yet — verify this once real testing is
 * possible and adjust the matching below if the wording differs.
 */
function mapAuthError(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('username') || lower.includes('database error saving new user')) {
    return 'That username is already taken. Please choose another.'
  }
  if (lower.includes('already registered') || lower.includes('already been registered')) {
    return 'An account with this email already exists. Try logging in instead.'
  }
  if (lower.includes('invalid login credentials')) {
    return 'Incorrect email or password.'
  }
  if (lower.includes('email not confirmed')) {
    return 'Please confirm your email before logging in.'
  }
  return message
}

export async function signUp({ username, email, password }: SignUpInput): Promise<SignUpResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })

  if (error) {
    throw new Error(mapAuthError(error.message))
  }

  return { session: data.session !== null }
}

export async function login({ email, password }: LoginInput): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    throw new Error(mapAuthError(error.message))
  }
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email, created_at, updated_at')
    .eq('id', userId)
    .single()

  if (error || !data) {
    throw new Error('Could not load your profile. Please try refreshing the page.')
  }

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}
