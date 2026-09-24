import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Artigos Jurídicos Estratégicos',
  description:
    'Artigos, teses e análises jurídicas sobre Recuperação Judicial, Agronegócio, Direito Médico, Tributário e Societário redigidos pela banca de EVI Advogados.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog & Artigos Jurídicos | EVI Sociedade de Advogados',
    description:
      'Análises aprofundadas sobre legislação, jurisprudência do STJ e estratégias empresariais para tomada de decisão.',
    url: 'https://evi.adv.br/blog',
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
