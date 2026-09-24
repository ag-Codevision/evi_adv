import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Corpo Jurídico & Advogados Especialistas',
  description:
    'Conheça a equipe de advogados e consultores especializados da EVI Sociedade de Advogados, sob liderança do Dr. Eduardo Veríssimo Inocente.',
  alternates: {
    canonical: '/nossos-profissionais',
  },
  openGraph: {
    title: 'Corpo Jurídico | EVI Sociedade de Advogados',
    description: 'Corpo técnico multidisciplinar preparado para os maiores desafios do Direito.',
    url: 'https://evi.adv.br/nossos-profissionais',
  },
};

export default function ProfissionaisLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
