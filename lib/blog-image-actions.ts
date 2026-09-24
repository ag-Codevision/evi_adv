'use server';

import { createClient } from './supabase/server';
import { saveSiteContent } from './site-content';
import { fetchTopicImages, CURATED_IMAGES, getCategoryKey, extractPhotoId } from './image-provider';
import { revalidatePath } from 'next/cache';

export interface AutoStockImageParams {
  page?: string;
  section?: string;
  fieldKey?: string;
  slug?: string;
  category?: string;
  title?: string;
  currentUrl?: string;
}

export interface AutoStockImageResult {
  success: boolean;
  imageUrl?: string;
  caption?: string;
  error?: string;
}

/**
 * Server Action que busca automaticamente uma imagem em alta resolução no banco de imagens
 * (Unsplash API ou acervo curado dinâmico) contextualizada com o tema/artigo e substitui imediatamente.
 */
export async function findAndReplaceBlogImageAction(
  params: AutoStockImageParams
): Promise<AutoStockImageResult> {
  try {
    const supabase = createClient();

    // 1. Validação de autenticação administrativa
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Acesso negado. Apenas administradores autenticados podem substituir imagens.',
      };
    }

    const page = params.page || 'blog_detail';
    const section = params.section || params.slug || 'artigo';
    const fieldKey = params.fieldKey || 'cover_image';
    const currentUrl = params.currentUrl || '';

    // 2. Extrai termos relevantes e categoria
    const categoryKey = getCategoryKey(params.category || params.slug || params.title || '');
    const currentPhotoId = extractPhotoId(currentUrl);

    // 3. Busca imagens temáticas no Unsplash / acervo
    const topicResult = await fetchTopicImages({
      categorySlug: categoryKey,
      title: params.title || '',
      excludeUrls: currentUrl ? [currentUrl] : [],
    });

    let chosenUrl = topicResult.cover;
    let chosenCaption = topicResult.body1?.caption || 'Registro fotográfico profissional em alta resolução.';

    // Se por acaso a capa retornada for idêntica à atual, busca uma alternativa diferente no acervo
    if (currentUrl && (chosenUrl === currentUrl || extractPhotoId(chosenUrl) === currentPhotoId)) {
      const pool = CURATED_IMAGES[categoryKey] || CURATED_IMAGES.civel || CURATED_IMAGES.recuperacao;
      const alternatives = pool.filter((img) => extractPhotoId(img.url) !== currentPhotoId);
      if (alternatives.length > 0) {
        const picked = alternatives[Math.floor(Math.random() * alternatives.length)];
        chosenUrl = picked.url;
        chosenCaption = picked.caption;
      } else if (topicResult.body1?.url && extractPhotoId(topicResult.body1.url) !== currentPhotoId) {
        chosenUrl = topicResult.body1.url;
      }
    }

    if (!chosenUrl) {
      return {
        success: false,
        error: 'Não foi possível encontrar uma imagem adequada no banco de dados de imagens.',
      };
    }

    // 4. Salva a nova URL na tabela site_contents
    const saveContentRes = await saveSiteContent({
      page,
      section,
      fieldKey,
      value: chosenUrl,
      contentType: 'image',
      metadata: {
        caption: chosenCaption,
        replaced_at: new Date().toISOString(),
        source: 'auto_stock_image',
      },
    });

    if (!saveContentRes.success) {
      return {
        success: false,
        error: saveContentRes.error || 'Erro ao persistir imagem na base de dados de conteúdos.',
      };
    }

    // 5. Se houver slug correspondente na tabela posts do Supabase, sincroniza cover_image
    const targetSlug = params.slug || (page === 'blog_detail' ? section : null);
    if (targetSlug && fieldKey === 'cover_image') {
      try {
        await supabase
          .from('posts')
          .update({
            cover_image: chosenUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('slug', targetSlug);
      } catch (postErr) {
        console.warn('[BlogImageAction] Post update warning (pode ser artigo local):', postErr);
      }
    }

    // 6. Revalidação de rotas no Next.js
    if (targetSlug) {
      revalidatePath(`/blog/${targetSlug}`);
    }
    revalidatePath('/blog');
    revalidatePath('/');

    return {
      success: true,
      imageUrl: chosenUrl,
      caption: chosenCaption,
    };
  } catch (err: any) {
    console.error('[BlogImageAction] Falha ao substituir imagem automaticamente:', err);
    return {
      success: false,
      error: err.message || 'Erro inesperado ao consultar o banco de imagens.',
    };
  }
}
