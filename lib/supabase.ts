import { Post } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Consulta de posts do Supabase via REST API nativa do PostgREST.
 * Não requer dependências pesadas no bundle do navegador e oferece suporte nativo a fetch caching.
 */
export async function fetchPosts(): Promise<Post[]> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return [];
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/posts?select=*,category:categories(*),author:authors(*)&order=published_at.desc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('Erro ao buscar posts do Supabase:', err);
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}&select=*,category:categories(*),author:authors(*)&limit=1`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data && data.length > 0 ? data[0] : null;
  } catch (err) {
    console.error('Erro ao buscar post por slug:', err);
    return null;
  }
}
