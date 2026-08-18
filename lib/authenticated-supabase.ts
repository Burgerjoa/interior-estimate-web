import { createClient } from '@/lib/supabase-server'

export async function getAuthenticatedSupabase() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return { supabase, user, error }
}
