import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quem Somos | Nossa História e Princípios',
  description:
    'Fundada em 2001, a EVI Sociedade de Advogados consolidou-se pela dedicação incansável aos interesses de seus clientes, com ética, vanguarda e excelência técnica.',
  alternates: {
    canonical: '/quem-somos',
  },
  openGraph: {
    title: 'Quem Somos | EVI Sociedade de Advogados',
    description:
      'Desde 2001 dedicando excelência e compromisso com o Direito Empresarial brasileiro.',
    url: 'https://evi.adv.br/quem-somos',
  },
};

export default function QuemSomosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
