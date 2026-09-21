-- ================================================================
-- EVI ADVOGADOS - SCRIPT DE BLINDAGEM DE SEGURANÇA (HARDENING RLS)
-- ================================================================
-- Este script define políticas de segurança rigorosas (Row Level Security)
-- garantindo que apenas administradores autenticados e a automação de IA
-- (via service_role) possam alterar informações no banco de dados.

-- 1. FUNÇÃO DE VERIFICAÇÃO DE PRIVILÉGIOS ADMINISTRATIVOS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- 1.1 Automação interna / IA (usa a chave mestra de serviço)
  IF auth.role() = 'service_role' THEN
    RETURN true;
  END IF;

  -- 1.2 Usuário com claim explícita de admin nos metadados JWT
  IF (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR 
     (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
    RETURN true;
  END IF;

  -- 1.3 E-mail corporativo mestre de administração
  IF lower(coalesce(auth.jwt() ->> 'email', '')) = 'admin@eviadvogados.com.br' THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. HABILITAR ROW LEVEL SECURITY EM TODAS AS TABELAS PÚBLICAS
ALTER TABLE IF EXISTS public.site_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.press_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.editorial_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.leads ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- 3. POLÍTICAS DA TABELA site_contents (Live CMS)
-- ================================================================
DROP POLICY IF EXISTS "Conteúdos do site são públicos para visualização" ON public.site_contents;
DROP POLICY IF EXISTS "Admins podem inserir conteúdos" ON public.site_contents;
DROP POLICY IF EXISTS "Admins podem atualizar conteúdos" ON public.site_contents;
DROP POLICY IF EXISTS "Admins podem excluir conteúdos" ON public.site_contents;

CREATE POLICY "Conteúdos do site são públicos para visualização" 
    ON public.site_contents FOR SELECT 
    USING (true);

CREATE POLICY "Admins podem inserir conteúdos" 
    ON public.site_contents FOR INSERT 
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins podem atualizar conteúdos" 
    ON public.site_contents FOR UPDATE 
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins podem excluir conteúdos" 
    ON public.site_contents FOR DELETE 
    USING (public.is_admin());

-- ================================================================
-- 4. POLÍTICAS DO BLOG (Posts, Categorias, Autores, Imprensa)
-- ================================================================
DROP POLICY IF EXISTS "Categorias visíveis publicamente" ON public.categories;
DROP POLICY IF EXISTS "Admins podem gerenciar categorias" ON public.categories;
CREATE POLICY "Categorias visíveis publicamente" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins podem gerenciar categorias" ON public.categories FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Autores visíveis publicamente" ON public.authors;
DROP POLICY IF EXISTS "Admins podem gerenciar autores" ON public.authors;
CREATE POLICY "Autores visíveis publicamente" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Admins podem gerenciar autores" ON public.authors FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Artigos visíveis publicamente" ON public.posts;
DROP POLICY IF EXISTS "Automação pode inserir e atualizar posts" ON public.posts;
DROP POLICY IF EXISTS "Admins podem gerenciar posts" ON public.posts;
CREATE POLICY "Artigos visíveis publicamente" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Admins e IA podem gerenciar posts" ON public.posts FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Imprensa visível publicamente" ON public.press_items;
DROP POLICY IF EXISTS "Admins podem gerenciar imprensa" ON public.press_items;
CREATE POLICY "Imprensa visível publicamente" ON public.press_items FOR SELECT USING (true);
CREATE POLICY "Admins podem gerenciar imprensa" ON public.press_items FOR ALL USING (public.is_admin());

-- ================================================================
-- 5. POLÍTICAS DA FILA EDITORIAL DA IA (editorial_queue)
-- ================================================================
DROP POLICY IF EXISTS "Automação pode gerenciar fila editorial" ON public.editorial_queue;
DROP POLICY IF EXISTS "Admins e IA podem gerenciar fila editorial" ON public.editorial_queue;
CREATE POLICY "Admins e IA podem gerenciar fila editorial" 
    ON public.editorial_queue FOR ALL 
    USING (public.is_admin());

-- ================================================================
-- 6. POLÍTICAS DE LEADS & CONTATOS (Privacidade LGPD)
-- ================================================================
-- Visitantes externos podem apenas INSERIR seus dados de contato
-- NUNCA podem consultar ou ler mensagens de outros clientes.
DROP POLICY IF EXISTS "Visitantes podem enviar contatos" ON public.leads;
DROP POLICY IF EXISTS "Admins podem gerenciar leads" ON public.leads;

CREATE POLICY "Visitantes podem enviar contatos" 
    ON public.leads FOR INSERT 
    WITH CHECK (
        length(name) >= 2 
        AND length(email) >= 5 
        AND length(message) >= 2
    );

CREATE POLICY "Apenas administradores podem ler e gerenciar leads" 
    ON public.leads FOR ALL 
    USING (public.is_admin());

-- ================================================================
-- 7. POLÍTICAS DE ARMAZENAMENTO (Supabase Storage)
-- ================================================================
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
        AND public.is_admin()
    );

CREATE POLICY "Admins podem atualizar mídias"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id IN ('site-media', 'blog-covers') 
        AND public.is_admin()
    );

CREATE POLICY "Admins podem excluir mídias"
    ON storage.objects FOR DELETE
    USING (
        bucket_id IN ('site-media', 'blog-covers') 
        AND public.is_admin()
    );
