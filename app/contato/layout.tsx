import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato & Atendimento Jurídico',
  description:
    'Entre em contato com a equipe de EVI Sociedade de Advogados. Atendimento consultivo e contencioso estratégico em todo o Brasil.',
  alternates: {
    canonical: '/contato',
  },
  openGraph: {
    title: 'Fale com EVI Sociedade de Advogados',
    description:
      'Canais diretos de atendimento jurídico para empresas, médicos e produtores rurais.',
    url: 'https://evi.adv.br/contato',
  },
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
