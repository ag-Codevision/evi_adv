import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dr. Eduardo Veríssimo Inocente | Sócio-Fundador OAB/SP 200.334',
  description:
    'Perfil do Dr. Eduardo Veríssimo Inocente, advogado sócio-fundador da EVI Sociedade de Advogados. Mais de 25 anos de experiência em Recuperação Judicial e Direito Empresarial.',
  alternates: {
    canonical: '/eduardo-verissimo',
  },
  openGraph: {
    title: 'Dr. Eduardo Veríssimo Inocente | EVI Sociedade de Advogados',
    description:
      'Advocacia de vanguarda e liderança jurídica empresarial em todo o território nacional.',
    url: 'https://evi.adv.br/eduardo-verissimo',
  },
};

export default function EduardoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
