'use server';

import { createClient } from './supabase/server';
import { revalidatePath } from 'next/cache';

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

    const postPayload = {
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

    let result;
    if (input.id) {
      result = await supabase
        .from('posts')
        .update(postPayload)
        .eq('id', input.id)
        .select('id')
        .single();
    } else {
      result = await supabase
        .from('posts')
        .insert({
          ...postPayload,
          published_at: new Date().toISOString(),
        })
        .select('id')
        .single();
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    revalidatePath('/blog');
    revalidatePath(`/blog/${input.slug}`);
    revalidatePath('/');

    return { success: true, postId: result.data?.id };
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
