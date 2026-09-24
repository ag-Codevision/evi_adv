'use server';

import { createClient } from './supabase/server';
import { revalidatePath } from 'next/cache';
import { saveSiteContent } from './site-content';

export interface UpsertPostInput {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id?: string;
  author_id?: string;
  cover_image?: string;
  reading_time?: number;
  is_featured?: boolean;
  published_at?: string;
  seo_title?: string;
  seo_description?: string;
}

/**
 * Cria ou atualiza um post no Supabase.
 */
export async function upsertPostAction(input: UpsertPostInput): Promise<{ success: boolean; error?: string; postId?: string }> {
  try {
    const supabase = createClient();

    // Valida autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Acesso negado. Faça login como administrador.' };
    }

    const postPayload: Record<string, any> = {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      category_id: input.category_id || null,
      author_id: input.author_id || null,
      cover_image: input.cover_image || null,
      reading_time: input.reading_time || 5,
      is_featured: input.is_featured ?? false,
      seo_title: input.seo_title || input.title,
      seo_description: input.seo_description || input.excerpt,
      updated_at: new Date().toISOString(),
    };

    if (input.published_at) {
      postPayload.published_at = input.published_at;
    }

    // Se não veio ID, ou veio id não-UUID, busca se já existe na tabela posts pelo slug!
    let targetPostId = input.id;
    if (input.slug) {
      const { data: existingPost } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', input.slug)
        .maybeSingle();

      if (existingPost?.id) {
        targetPostId = existingPost.id;
      }
    }

    let result;
    if (targetPostId) {
      result = await supabase
        .from('posts')
        .update(postPayload)
        .eq('id', targetPostId)
        .select('id')
        .single();
    } else {
      result = await supabase
        .from('posts')
        .insert({
          ...postPayload,
          published_at: input.published_at || new Date().toISOString(),
        })
        .select('id')
        .single();
    }

    if (result.error) {
      console.error('[upsertPostAction] Erro no Supabase:', result.error);
      return { success: false, error: result.error.message };
    }

    // Garante persistência da capa em site_contents para sincronização completa de todos os componentes
    if (input.cover_image && input.slug) {
      try {
        await saveSiteContent({
          page: 'blog_detail',
          section: input.slug,
          fieldKey: 'cover_image',
          value: input.cover_image,
          contentType: 'image',
          metadata: {
            updated_via: 'upsertPostAction',
            updated_at: new Date().toISOString(),
          },
        });
      } catch (contentErr) {
        console.warn('[upsertPostAction] Aviso ao salvar cover_image em site_contents:', contentErr);
      }
    }

    revalidatePath('/blog');
    revalidatePath(`/blog/${input.slug}`);
    revalidatePath('/');

    return { success: true, postId: result.data?.id || targetPostId };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro inesperado ao salvar post.' };
  }
}

/**
 * Exclui um post do Supabase pelo ID.
 */
export async function deletePostAction(postId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Acesso negado.' };
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/blog');
    revalidatePath('/');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro inesperado ao excluir post.' };
  }
}
