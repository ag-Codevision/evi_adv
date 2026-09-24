import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Áreas de Atuação Jurídica Especializada',
  description:
    'Conheça os eixos de atuação de EVI Advogados: Recuperação Judicial e Falências, Agronegócio, Direito Médico, Cível Estratégico, Trabalhista e Societário.',
  alternates: {
    canonical: '/areas-de-atuacao',
  },
  openGraph: {
    title: 'Áreas de Atuação | EVI Sociedade de Advogados',
    description:
      'Excelência consultiva e contenciosa nas áreas mais complexas do Direito Empresarial brasileiro.',
    url: 'https://evi.adv.br/areas-de-atuacao',
  },
};

export default function AreasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
