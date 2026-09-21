-- ================================================================
-- EVI ADVOGADOS - MÓDULO CMS VISUAL & SITE CONTENTS (IDEMPOTENTE)
-- ================================================================

-- 1. Tabela Universal de Conteúdos da Página (Textos, Imagens, Vídeos)
CREATE TABLE IF NOT EXISTS public.site_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    field_key TEXT NOT NULL,
    content_type TEXT NOT NULL DEFAULT 'text',
    content_value TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT site_contents_page_section_field_key_unique UNIQUE(page, section, field_key)
);

-- Índices de performance
CREATE INDEX IF NOT EXISTS idx_site_contents_lookup ON public.site_contents (page, section);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.site_contents ENABLE ROW LEVEL SECURITY;

-- Limpar políticas anteriores para evitar erro de duplicidade
DROP POLICY IF EXISTS "Conteúdos do site são públicos para visualização" ON public.site_contents;
DROP POLICY IF EXISTS "Admins podem inserir conteúdos" ON public.site_contents;
DROP POLICY IF EXISTS "Admins podem atualizar conteúdos" ON public.site_contents;
DROP POLICY IF EXISTS "Admins podem excluir conteúdos" ON public.site_contents;

-- Criar Políticas de RLS em site_contents
CREATE POLICY "Conteúdos do site são públicos para visualização" 
    ON public.site_contents FOR SELECT USING (true);

CREATE POLICY "Admins podem inserir conteúdos" 
    ON public.site_contents FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Admins podem atualizar conteúdos" 
    ON public.site_contents FOR UPDATE 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "Admins podem excluir conteúdos" 
    ON public.site_contents FOR DELETE 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ================================================================
-- POLÍTICAS ADICIONAIS DE GERENCIAMENTO PELO ADMIN
-- ================================================================
DROP POLICY IF EXISTS "Admins podem gerenciar categorias" ON public.categories;
CREATE POLICY "Admins podem gerenciar categorias" 
    ON public.categories FOR ALL 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins podem gerenciar autores" ON public.authors;
CREATE POLICY "Admins podem gerenciar autores" 
    ON public.authors FOR ALL 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins podem gerenciar imprensa" ON public.press_items;
CREATE POLICY "Admins podem gerenciar imprensa" 
    ON public.press_items FOR ALL 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins podem gerenciar leads" ON public.leads;
CREATE POLICY "Admins podem gerenciar leads" 
    ON public.leads FOR ALL 
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ================================================================
-- BUCKETS DE ARMAZENAMENTO (Supabase Storage)
-- ================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('site-media', 'site-media', true),
    ('blog-covers', 'blog-covers', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Mídias do site são públicas para visualização" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem fazer upload de mídias" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem atualizar mídias" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem excluir mídias" ON storage.objects;

CREATE POLICY "Mídias do site são públicas para visualização"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('site-media', 'blog-covers'));

CREATE POLICY "Admins podem fazer upload de mídias"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id IN ('site-media', 'blog-covers') 
        AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );

CREATE POLICY "Admins podem atualizar mídias"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id IN ('site-media', 'blog-covers') 
        AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );

CREATE POLICY "Admins podem excluir mídias"
    ON storage.objects FOR DELETE
    USING (
        bucket_id IN ('site-media', 'blog-covers') 
        AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );

-- ================================================================
-- CONTEÚDO INICIAL DA HOME (SEEDS PADRÃO)
-- ================================================================
INSERT INTO public.site_contents (page, section, field_key, content_type, content_value) VALUES
('home', 'hero', 'tagline', 'text', '25 ANOS DE EXCELÊNCIA JURÍDICA NACIONAL'),
('home', 'hero', 'title', 'text', 'Defesa Estratégica e Soluções Jurídicas de Alta Complexidade'),
('home', 'hero', 'subtitle', 'text', 'Liderado pelo Dr. Eduardo Veríssimo Inocente, nosso escritório une tradição, autoridade doutrinária e inovação tecnológica para proteger seus interesses com máximo rigor ético.'),
('home', 'hero', 'cta_primary', 'text', 'Agendar Consulta Estratégica'),
('home', 'hero', 'cta_secondary', 'text', 'Conhecer Áreas de Atuação'),
('home', 'hero', 'hero_image', 'image', '/assets/hero.jpg'),
('home', 'institucional', 'video_url', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
('global', 'header', 'phone', 'text', '(11) 4125-1000'),
('global', 'header', 'whatsapp', 'text', '(11) 99999-8888'),
('global', 'header', 'address', 'text', 'São Paulo • São Bernardo do Campo • Atuação Nacional')
ON CONFLICT (page, section, field_key) DO NOTHING;
