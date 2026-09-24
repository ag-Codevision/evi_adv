import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diferenciais Competitivos & Metodologia',
  description:
    'Descubra os diferenciais de EVI Advogados: atendimento humanizado e corporativo, visão multidisciplinar, tecnologia de vanguarda e foco em resultados concretos.',
  alternates: {
    canonical: '/diferenciais',
  },
  openGraph: {
    title: 'Diferenciais | EVI Sociedade de Advogados',
    description: 'Atuação jurídica artesanal combinada com precisão estratégica de alto impacto.',
    url: 'https://evi.adv.br/diferenciais',
  },
};

export default function DiferenciaisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
