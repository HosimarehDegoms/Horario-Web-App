import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to Horario/.env (see .env.example).',
  )
}

/**
 * The anon key is safe to ship in frontend code by design — it identifies
 * the project, not a privileged caller. Row Level Security on every table
 * is what actually enforces per-user access, not this key's secrecy.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
