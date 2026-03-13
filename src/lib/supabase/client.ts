import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }

  if (!client) {
    client = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: false,
      },
    });
  }

  return client;
}

