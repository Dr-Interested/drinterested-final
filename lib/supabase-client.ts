import { createClient } from "@supabase/supabase-js"
import { resilientFetch } from "./resilient-fetch"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// A3 fix: validate on both client and server — fail loudly rather than silently
// using placeholder credentials that cause silent data failures on SSR pages
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables.\n" +
    "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local"
  )
}

// global.fetch covers every request this client makes — data, auth, storage — so the
// network-blocked-wifi fallback in resilientFetch (see lib/resilient-fetch.ts) applies
// uniformly, including to login itself, not just data reads.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: { fetch: resilientFetch },
})