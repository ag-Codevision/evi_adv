-- ================================================================
-- EVI ADVOGADOS - ESQUEMA DO BANCO DE DADOS (SUPABASE POSTGRESQL)
-- ================================================================

-- 1. Categorias do Blog Jurídico
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Autores / Advogados
CREATE TABLE IF NOT EXISTS public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    oab TEXT,
    bio TEXT,
    avatar_url TEXT,
    is_director BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Artigos do Blog (Posts)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
    cover_image TEXT,
    published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    reading_time INTEGER DEFAULT 5,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Clipping & Imprensa
CREATE TABLE IF NOT EXISTS public.press_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    media_outlet TEXT NOT NULL,
    outlet_logo TEXT,
    article_url TEXT,
    quote TEXT,
    published_at DATE NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Fila Editorial da IA (GitHub Actions + NVIDIA API)
CREATE TABLE IF NOT EXISTS public.editorial_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT NOT NULL,
    target_category_slug TEXT NOT NULL,
    keywords TEXT[],
    target_audience TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'published', 'failed')),
    generated_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
    error_message TEXT,
    scheduled_for TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Leads & Mensagens de Contato
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    area_interest TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================================================
-- POLÍTICAS DE SEGURANÇA (Row Level Security - RLS)
-- ================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Leitura pública para o site
CREATE POLICY "Categorias visíveis publicamente" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Autores visíveis publicamente" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Artigos visíveis publicamente" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Imprensa visível publicamente" ON public.press_items FOR SELECT USING (true);

-- Leads: inserção pública (qualquer visitante pode mandar mensagem)
CREATE POLICY "Visitantes podem enviar contatos" ON public.leads FOR INSERT WITH CHECK (true);

-- Fila editorial e gerenciamento: restrito à Service Role (automação IA) ou usuários autenticados
CREATE POLICY "Automação pode gerenciar fila editorial" ON public.editorial_queue USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');
CREATE POLICY "Automação pode inserir e atualizar posts" ON public.posts FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ================================================================
-- DADOS INICIAIS: Categorias do Catálogo EVI
-- ================================================================
INSERT INTO public.categories (name, slug, description) VALUES
('Recuperação Judicial & Falências', 'recuperacao-judicial', 'Estratégias de preservação de empresas, blindagem, renegociação de dívidas e planos de recuperação.'),
('Agronegócio & Títulos de Crédito', 'agronegocio', 'CPR, custeio safra, fiagro, recuperação de crédito rural e renegociação de operações agrícolas.'),
('Contencioso Estratégico & Societário', 'contencioso-estrategico', 'Disputas societárias de alta complexidade, dissolução de sociedades e litígios cíveis corporativos.'),
('Direito Tributário Empresarial', 'tributario-empresarial', 'Defesa em autos de infração, recuperação de créditos tributários e planejamento fiscal estratégico.'),
('Direito Imobiliário & Infraestrutura', 'imobiliario-infraestrutura', 'Regularização fundiária, incorporações, contratos de alta monta e disputas de posse/propriedade.')
ON CONFLICT (slug) DO NOTHING;

-- DADOS INICIAIS: Autor Principal (Dr. Eduardo Veríssimo Inocente)
INSERT INTO public.authors (name, role, oab, bio, avatar_url, is_director) VALUES
('Dr. Eduardo Veríssimo Inocente', 'Sócio-Fundador & Diretor Jurídico', 'OAB/SP 200.322', 'Advogado com mais de 25 anos de atuação de vanguarda no Direito Empresarial, referência nacional em Recuperação Judicial, Reestruturação de Passivos e Agronegócio.', '/assets/hero.jpg', true)
ON CONFLICT DO NOTHING;
