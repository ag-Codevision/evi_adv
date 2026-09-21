import { createClient as createDirectClient } from '@supabase/supabase-js';

/**
 * Cria um cliente Supabase direto, sem dependência de cookies de navegador.
 * Essencial para operações em segundo plano, cron jobs na Vercel e scripts autônomos.
 */
export function getDirectSupabase(useServiceRole = false) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key =
    (useServiceRole ? process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    '';

  return createDirectClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
