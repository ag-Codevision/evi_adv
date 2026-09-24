import React from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { Metadata } from 'next';
import { Shield, Lock, FileText, CheckCircle2, UserCheck, Mail, ArrowLeft } from 'lucide-react';
import OpenCookieSettingsButton from '@/components/OpenCookieSettingsButton';

export const metadata: Metadata = {
  title: 'Política de Privacidade e Proteção de Dados (LGPD)',
  description:
    'Diretrizes de privacidade, segurança da informação e tratamento de dados pessoais da EVI Sociedade de Advogados em estrita conformidade com a LGPD (Lei nº 13.709/2018).',
  alternates: {
    canonical: '/politica-de-privacidade',
  },
  openGraph: {
    title: 'Política de Privacidade | EVI Sociedade de Advogados',
    description:
      'Transparência e segurança no tratamento de dados pessoais conforme a Lei Geral de Proteção de Dados.',
    url: 'https://evi.adv.br/politica-de-privacidade',
  },
};

export default function PoliticaPrivacidadePage() {
  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-12 md:py-16">
        <div className="container max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-evi-text-muted mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-evi-accent">Início</Link>
            <span>/</span>
            <span className="text-evi-deep font-semibold">Política de Privacidade & LGPD</span>
          </nav>

          {/* Cabeçalho do Documento */}
          <header className="bg-white rounded-3xl p-8 md:p-12 border border-evi-border shadow-evi-card mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-evi-deep/5 border border-evi-deep/15 text-evi-deep text-xs font-bold tracking-wide uppercase mb-4">
              <Shield className="w-3.5 h-3.5 text-evi-accent" />
              <span>Conformidade Jurídica Integral</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-serif text-evi-deep font-bold mb-4">
              Política de Privacidade e Proteção de Dados Pessoais
            </h1>

            <p className="text-sm md:text-base text-evi-text-light leading-relaxed mb-6">
              Em estrita observância à Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018 – LGPD), a <strong>EVI Sociedade de Advogados</strong> reafirma seu compromisso inegociável com a segurança, transparência e confidencialidade no tratamento das informações de seus clientes, parceiros e visitantes.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-evi-border/60 text-xs text-evi-text-muted">
              <span>Última atualização: Setembro de 2026</span>
              <OpenCookieSettingsButton />
            </div>
          </header>

          {/* Conteúdo Institucional Jurídico */}
          <article className="bg-white rounded-3xl p-8 md:p-12 border border-evi-border shadow-evi-card space-y-10 text-evi-text leading-relaxed text-sm md:text-base">
            {/* Seção 1 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-evi-deep flex items-center gap-2.5 pb-2 border-b border-evi-border/60">
                <FileText className="w-5 h-5 text-evi-accent" />
                1. Identificação do Controlador
              </h2>
              <p>
                O Controlador dos dados pessoais tratados através deste portal é a <strong>EVI Sociedade de Advogados</strong>, pessoa jurídica de direito privado devidamente inscrita na OAB/SP sob liderança do Dr. Eduardo Veríssimo Inocente (OAB/SP 200.334).
              </p>
              <p>
                Para exercer qualquer um de seus direitos ou esclarecer dúvidas operacionais, nosso Encarregado pelo Tratamento de Dados Pessoais (DPO) poderá ser acionado pelo canal oficial: <a href="mailto:dpo@evi.adv.br" className="text-evi-accent font-semibold hover:underline">dpo@evi.adv.br</a> ou através de nossa <Link href="/contato" className="text-evi-accent font-semibold hover:underline">página de contato</Link>.
              </p>
            </section>

            {/* Seção 2 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-evi-deep flex items-center gap-2.5 pb-2 border-b border-evi-border/60">
                <Lock className="w-5 h-5 text-evi-accent" />
                2. Quais Dados Pessoais Coletamos e Para Que Finalidades?
              </h2>
              <p>Tratamos o mínimo indispensável de informações para o cumprimento das seguintes finalidades legítimas:</p>
              <div className="space-y-3 pl-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-evi-deep text-sm mb-1">A) Dados Fornecidos Diretamente pelo Usuário</h3>
                  <p className="text-xs text-slate-600">
                    Nome completo, e-mail corporativo/pessoal, número de telefone/WhatsApp e descrição preliminar de demandas submetidas em nossos formulários de contato ou via WhatsApp.
                    <br /><strong>Finalidade e Base Legal:</strong> Execução de procedimentos preliminares a pedido do titular para prestação de serviços jurídicos (Art. 7º, V da LGPD).
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-evi-deep text-sm mb-1">B) Dados de Navegação Técnica e Cookies</h3>
                  <p className="text-xs text-slate-600">
                    Endereço IP anonimizado, tipo de navegador, páginas visualizadas e tempo de permanência.
                    <br /><strong>Finalidade e Base Legal:</strong> Garantia da segurança de redes e legítimo interesse institucional na melhoria da experiência de navegação técnica (Art. 7º, IX da LGPD).
                  </p>
                </div>
              </div>
            </section>

            {/* Seção 3 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-evi-deep flex items-center gap-2.5 pb-2 border-b border-evi-border/60">
                <UserCheck className="w-5 h-5 text-evi-accent" />
                3. Seus Direitos como Titular de Dados Pessoais
              </h2>
              <p>
                Conforme o <strong>Artigo 18 da LGPD</strong>, você possui a faculdade de, a qualquer momento e mediante requisição formal e gratuita, solicitar:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
                <li className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Confirmação da existência de tratamento dos seus dados;</span>
                </li>
                <li className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Acesso aos dados pessoais custodiados pelo escritório;</span>
                </li>
                <li className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Correção de dados incompletos, inexatos ou desatualizados;</span>
                </li>
                <li className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Anonimização, bloqueio ou eliminação de dados desnecessários;</span>
                </li>
                <li className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/60 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Revogação a qualquer tempo do consentimento concedido.</span>
                </li>
              </ul>
            </section>

            {/* Seção 4 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-evi-deep flex items-center gap-2.5 pb-2 border-b border-evi-border/60">
                <Shield className="w-5 h-5 text-evi-accent" />
                4. Segurança, Sigilo Profissional e Retenção
              </h2>
              <p>
                A advocacia é pautada por rigoroso dever ético de sigilo profissional (Estatuto da OAB e Código de Ética e Disciplina). Adotamos salvaguardas técnicas, criptografia de tráfego (HTTPS/TLS) e protocolos estritos de governança para mitigar acessos não autorizados, destruição ou vazamento de dados.
              </p>
              <p>
                Os dados pertinentes a atendimentos e contratos são mantidos pelos períodos fixados nos prazos prescricionais vigentes no Código Civil e na legislação tributária e processual brasileira.
              </p>
            </section>

            {/* Seção 5 */}
            <section className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-evi-deep flex items-center gap-2.5 pb-2 border-b border-evi-border/60">
                <Mail className="w-5 h-5 text-evi-accent" />
                5. Contato com o Encarregado (DPO)
              </h2>
              <p>
                Caso queira apresentar requerimento relativo aos seus dados pessoais, entre em contato diretamente com nossa equipe encarregada:
              </p>
              <div className="p-5 rounded-2xl bg-evi-deep text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="font-bold text-base">Encarregado pelo Tratamento de Dados (DPO)</p>
                  <p className="text-xs text-slate-300">EVI Sociedade de Advogados · São Paulo - SP</p>
                  <p className="text-xs text-amber-300 font-mono">privacidade@evi.adv.br</p>
                </div>
                <Link
                  href="/contato"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-lg"
                >
                  Falar Conosco
                </Link>
              </div>
            </section>

            {/* Voltar */}
            <div className="pt-6 border-t border-evi-border flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-evi-deep hover:text-evi-accent uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar à Página Inicial</span>
              </Link>
              <OpenCookieSettingsButton />
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
