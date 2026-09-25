import { MetadataRoute } from 'next';
import { getDirectSupabase } from '@/lib/supabase/direct';
import { getAllBlogArticles } from '@/lib/blog-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.evi.adv.br';

  // Páginas institucionais estáticas prioritárias
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/areas-de-atuacao`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/eduardo-verissimo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quem-somos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/diferenciais`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/nossa-estrutura`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/nossos-profissionais`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/historico`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/imprensa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/podcast`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/atendimento`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Coleta posts do banco de dados (Supabase)
  const dynamicBlogRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = getDirectSupabase(true);
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, published_at')
      .not('slug', 'is', null);

    if (posts && posts.length > 0) {
      posts.forEach((post) => {
        if (post.slug) {
          dynamicBlogRoutes.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updated_at || post.published_at || new Date()),
            changeFrequency: 'weekly',
            priority: 0.85,
          });
        }
      });
    }
  } catch (error) {
    console.error('Erro ao gerar sitemap dinâmico do banco:', error);
  }

  // Coleta artigos locais pré-definidos (se não estiverem no Supabase)
  const localArticles = getAllBlogArticles();
  const existingUrls = new Set(dynamicBlogRoutes.map((r) => r.url));

  localArticles.forEach((article) => {
    const postUrl = `${baseUrl}/blog/${article.slug}`;
    if (!existingUrls.has(postUrl)) {
      dynamicBlogRoutes.push({
        url: postUrl,
        lastModified: new Date(article.publishedAt || article.date || new Date()),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
      existingUrls.add(postUrl);
    }
  });

  return [...staticRoutes, ...dynamicBlogRoutes];
}
