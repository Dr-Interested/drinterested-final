import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Server-only Supabase client that bypasses Row Level Security.
 *
 * Cron routes run with no user session, so the normal anon client (lib/supabase-client)
 * can't see RLS-gated rows it doesn't "own" — e.g. the task-reminders cron needs to read
 * EVERY open task and email its assignee. That only works with the service role key.
 *
 * NEVER import this into a Client Component or any code that ships to the browser.
 * If SUPABASE_SERVICE_ROLE_KEY isn't set it falls back to the anon key with a warning,
 * and RLS-gated reads (tasks, etc.) will come back empty.
 */
if (!url || (!serviceKey && !anonKey)) {
  throw new Error("Missing Supabase env vars for the admin client (NEXT_PUBLIC_SUPABASE_URL + a key).")
}
if (!serviceKey) {
  console.warn(
    "SUPABASE_SERVICE_ROLE_KEY is not set — cron DB access will be RLS-limited and task emails won't send.",
  )
}

export const supabaseAdmin = createClient(url, serviceKey || anonKey!, {
  auth: { persistSession: false, autoRefreshToken: false },
})
