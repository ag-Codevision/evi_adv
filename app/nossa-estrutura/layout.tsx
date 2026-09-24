import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nossa Estrutura | Tecnologia e Segurança Jurídica',
  description:
    'Infraestrutura física moderna, sistemas digitais de segurança da informação e salas dedicadas para acolhimento de clientes em EVI Advogados.',
  alternates: {
    canonical: '/nossa-estrutura',
  },
  openGraph: {
    title: 'Nossa Estrutura | EVI Sociedade de Advogados',
    description: 'Instalações preparadas para negociações corporativas de alta complexidade.',
    url: 'https://evi.adv.br/nossa-estrutura',
  },
};

export default function EstruturaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
