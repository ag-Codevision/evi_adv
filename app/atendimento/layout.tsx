import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Canais de Atendimento & Consulta Inicial',
  description:
    'Como funciona o atendimento na EVI Sociedade de Advogados: canais digitais, agendamento de reuniões executivas e triagem personalizada de casos.',
  alternates: {
    canonical: '/atendimento',
  },
  openGraph: {
    title: 'Atendimento Jurídico | EVI Sociedade de Advogados',
    description: 'Agilidade, confidencialidade e atendimento direto por especialistas.',
    url: 'https://evi.adv.br/atendimento',
  },
};

export default function AtendimentoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
