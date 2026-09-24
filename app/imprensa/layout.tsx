import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Imprensa & Entrevistas | Presença nos Principais Portais e TV',
  description:
    'Acompanhe as participações do Dr. Eduardo Veríssimo e da equipe da EVI Advogados na mídia nacional: Record TV, portais de notícias e artigos opinativos.',
  alternates: {
    canonical: '/imprensa',
  },
  openGraph: {
    title: 'EVI na Imprensa | EVI Sociedade de Advogados',
    description: 'Comentários jurídicos, análises de mercado e presenças na mídia sobre os principais temas do país.',
    url: 'https://evi.adv.br/imprensa',
  },
};

export default function ImprensaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
