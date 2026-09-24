import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Topbar from '@/components/Topbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ScrollMotionManager from '@/components/ScrollMotionManager';
import AdminAuthProvider from '@/components/admin/AdminAuthProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EVI Sociedade de Advogados | Advocacia Empresarial e Estratégica',
    template: '%s | EVI Advogados',
  },
  description:
    'Consultoria e atuação contenciosa em Direito Médico, Cível, Família, Trabalhista, Recuperação Judicial e Agronegócio, atendendo clientes em todo o território nacional.',
  keywords: [
    'EVI Advogados',
    'Eduardo Veríssimo Inocente',
    'Recuperação Judicial',
    'Agronegócio',
    'Direito Médico',
    'Direito Empresarial',
    'Direito Tributário',
    'Direito Cível',
    'Advocacia Estratégica',
    'Advogados São Paulo',
  ],
  authors: [{ name: 'Dr. Eduardo Veríssimo Inocente', url: 'https://evi.adv.br/eduardo-verissimo' }],
  creator: 'EVI Sociedade de Advogados',
  publisher: 'EVI Sociedade de Advogados',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://evi.adv.br'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'EVI Sociedade de Advogados | Advocacia Empresarial e Estratégica',
    description:
      'Desde 2001 · Excelência Jurídica e Atendimento Consultivo em Todo o Brasil.',
    url: 'https://evi.adv.br',
    siteName: 'EVI Sociedade de Advogados',
    images: [
      {
        url: '/assets/logo.png',
        width: 800,
        height: 600,
        alt: 'EVI Sociedade de Advogados',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EVI Sociedade de Advogados | Advocacia Empresarial e Estratégica',
    description: 'Excelência Jurídica em Recuperação Judicial, Agronegócio, Direito Médico e Empresarial.',
    images: ['/assets/logo.png'],
  },
  icons: {
    icon: '/assets/logo.png',
  },
};

const legalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'EVI Sociedade de Advogados',
  alternateName: 'Eduardo Veríssimo Inocente Sociedade de Advogados',
  url: 'https://evi.adv.br',
  logo: 'https://evi.adv.br/assets/logo.png',
  image: 'https://evi.adv.br/assets/logo.png',
  description:
    'Sociedade de advogados fundada em 2001, especializada em Recuperação Judicial, Agronegócio, Direito Médico, Cível e Empresarial com atuação nacional.',
  founder: {
    '@type': 'Person',
    name: 'Dr. Eduardo Veríssimo Inocente',
    jobTitle: 'Advogado Sócio-Fundador',
    url: 'https://evi.adv.br/eduardo-verissimo',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Brasil',
  },
  knowsAbout: [
    'Recuperação Judicial',
    'Falência e Reestruturação',
    'Crédito Rural e Agronegócio',
    'Direito Médico e Hospitalar',
    'Direito Empresarial e Societário',
    'Direito Tributário',
  ],
  priceRange: '$$$$',
};

import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';
import SiteContentProvider from '@/components/admin/SiteContentProvider';
import { getAllSiteContents } from '@/lib/site-content';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialContents = await getAllSiteContents();

  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceSchema) }}
        />
      </head>
      <body>
        <AdminAuthProvider>
          <SiteContentProvider initialContents={initialContents}>
            <ClientLayoutWrapper
              topbar={<Topbar />}
              motion={<ScrollMotionManager />}
              footer={<Footer />}
              whatsapp={<WhatsAppFloat />}
            >
              {children}
            </ClientLayoutWrapper>
          </SiteContentProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
