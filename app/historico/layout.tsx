import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Histórico & Linha do Tempo | Trajetória Desde 2001',
  description:
    'A evolução histórica da EVI Sociedade de Advogados ao longo de mais de duas décadas de liderança no Direito brasileiro.',
  alternates: {
    canonical: '/historico',
  },
  openGraph: {
    title: 'Histórico & Trajetória | EVI Sociedade de Advogados',
    description: 'Mais de 25 anos construindo teses vencedoras e recuperando empresas em todo o país.',
    url: 'https://evi.adv.br/historico',
  },
};

export default function HistoricoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
