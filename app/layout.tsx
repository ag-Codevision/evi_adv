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
  title: 'EVI Sociedade de Advogados | Advocacia Empresarial e Estratégica',
  description:
    'Consultoria e atuação contenciosa em Direito Médico, Cível, Família, Trabalhista, Recuperação Judicial e Agronegócio, atendendo clientes em todo o território nacional.',
  keywords: [
    'EVI Advogados',
    'Eduardo Veríssimo Inocente',
    'Recuperação Judicial',
    'Agronegócio',
    'Direito Médico',
    'Direito Empresarial',
    'Direito Cível',
    'Advocacia Estratégica',
  ],
  authors: [{ name: 'EVI Sociedade de Advogados' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://evi.adv.br'),
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
  icons: {
    icon: '/assets/logo.png',
  },
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
