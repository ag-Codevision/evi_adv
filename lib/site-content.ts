'use server';

import { createClient } from './supabase/server';
import { revalidatePath } from 'next/cache';

export interface SiteContentItem {
  id?: string;
  page: string;
  section: string;
  field_key: string;
  content_type: 'text' | 'html' | 'image' | 'video' | 'link' | 'list';
  content_value: string;
  metadata?: Record<string, any>;
  updated_at?: string;
}

/**
 * Busca todos os blocos de conteúdo cadastrados para uma página específica.
 */
export async function getPageContents(page: string): Promise<Record<string, string>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('site_contents')
      .select('section, field_key, content_value')
      .eq('page', page);

    if (error || !data) {
      return {};
    }

    // Mapeia em formato de dicionário: "section.field_key": "content_value"
    const contentsMap: Record<string, string> = {};
    data.forEach((item) => {
      contentsMap[`${item.section}.${item.field_key}`] = item.content_value;
    });

    return contentsMap;
  } catch (err) {
    console.error(`Erro ao buscar conteúdos da página ${page}:`, err);
    return {};
  }
}

/**
 * Atualiza ou insere (Upsert) um bloco de conteúdo na tabela site_contents.
 * Apenas executado com sucesso se o usuário estiver autenticado como administrador.
 */
export async function saveSiteContent(params: {
  page: string;
  section: string;
  fieldKey: string;
  value: string;
  contentType?: 'text' | 'html' | 'image' | 'video' | 'link' | 'list';
  metadata?: Record<string, any>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    // Valida autenticação do usuário
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Acesso negado. Apenas administradores autenticados podem editar o site.' };
    }

    const { error: upsertError } = await supabase
      .from('site_contents')
      .upsert(
        {
          page: params.page,
          section: params.section,
          field_key: params.fieldKey,
          content_type: params.contentType || 'text',
          content_value: params.value,
          metadata: params.metadata || {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'page,section,field_key' }
      );

    if (upsertError) {
      console.error('Erro ao salvar site_content:', upsertError);
      return { success: false, error: upsertError.message };
    }

    // Revalida a página no cache do Next.js para refletir imediatamente a alteração
    const targetPath = params.page === 'home' ? '/' : `/${params.page}`;
    revalidatePath(targetPath);

    return { success: true };
  } catch (err: any) {
    console.error('Falha inesperada ao salvar conteúdo:', err);
    return { success: false, error: err.message || 'Erro inesperado' };
  }
}

/**
 * Remove um item de conteúdo do banco de dados (exclusão de matéria ou item customizado).
 */
export async function deleteSiteContent(params: {
  page: string;
  section: string;
  fieldKey: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Acesso negado. Apenas administradores autenticados podem excluir conteúdo.' };
    }

    const { error: delError } = await supabase
      .from('site_contents')
      .delete()
      .match({
        page: params.page,
        section: params.section,
        field_key: params.fieldKey,
      });

    if (delError) {
      console.error('Erro ao excluir site_content:', delError);
      return { success: false, error: delError.message };
    }

    const targetPath = params.page === 'home' ? '/' : `/${params.page}`;
    revalidatePath(targetPath);

    return { success: true };
  } catch (err: any) {
    console.error('Falha inesperada ao excluir conteúdo:', err);
    return { success: false, error: err.message || 'Erro inesperado' };
  }
}

/**
 * Busca todos os registros de uma seção específica, retornando a lista completa com id, field_key e content_value.
 */
export async function getSectionContents(page: string, section: string): Promise<Array<{ field_key: string; content_value: string }>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('site_contents')
      .select('field_key, content_value')
      .eq('page', page)
      .eq('section', section);

    if (error || !data) {
      return [];
    }

    return data;
  } catch (err) {
    console.error(`Erro ao buscar conteúdos de ${page}.${section}:`, err);
    return [];
  }
}

/**
 * Upload de imagens diretamente para o Supabase Storage (bucket 'site-media').
 */
export async function uploadSiteMedia(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Acesso não autorizado.' };
    }

    const file = formData.get('file') as File | null;
    if (!file) {
      return { success: false, error: 'Nenhum arquivo enviado.' };
    }

    // Sanitiza e gera nome único para o arquivo
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('site-media')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('site-media')
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'Erro no upload de mídia' };
  }
}
