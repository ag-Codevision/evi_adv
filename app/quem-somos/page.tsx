'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import EditableText from '@/components/admin/EditableText';
import EditableMedia from '@/components/admin/EditableMedia';
import EditableLink from '@/components/admin/EditableLink';
import EditableList from '@/components/admin/EditableList';
import EditableMediaOrVideo from '@/components/admin/EditableMediaOrVideo';
import { uploadSiteMedia } from '@/lib/site-content';

/* ─── Formulário de Adicionar Membro (componente separado para respeitar regras de hooks) ─── */
function AddTeamMemberForm({ onAdd, onCancel }: { onAdd: (item: TeamMember) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Advogado(a)');
  const [bioText, setBioText] = useState('');
  const [image, setImage] = useState('/img/04.png');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadSiteMedia(formData);
    if (res.success && res.url) {
      setImage(res.url);
    }
  };

  return (
    <div className="space-y-4 text-left">
      <h4 className="font-bold text-slate-800 text-sm">Adicionar Novo Integrante da Equipe</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600">Nome Completo</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Dra. Juliana Menezes"
            className="w-full text-xs p-2 border rounded border-slate-300"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Cargo / Função</label>
          <input
            type="text"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Ex: Advogada Especialista em Direito Médico"
            className="w-full text-xs p-2 border rounded border-slate-300"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Foto do Profissional</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-sky-600 file:text-white"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Qualificações / Bio (um tópico por linha)</label>
        <textarea
          rows={3}
          required
          value={bioText}
          onChange={(e) => setBioText(e.target.value)}
          placeholder="Insira os pontos principais de atuação e histórico acadêmico..."
          className="w-full text-xs p-2 border rounded border-slate-300"
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-200 rounded"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => {
            if (!name.trim()) return;
            const bio = bioText.split('\n').map((b) => b.trim()).filter(Boolean);
            onAdd({ name, role, image, bio });
          }}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded"
        >
          Salvar Novo Integrante
        </button>
      </div>
    </div>
  );
}

/* ─── Formulário de Adicionar Evento na Timeline (componente separado) ─── */
function AddTimelineEventForm({ onAdd, onCancel }: { onAdd: (item: TimelineEvent) => void; onCancel: () => void }) {
  const [year, setYear] = useState('2026');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <div className="space-y-3 p-4 bg-white border border-slate-300 rounded-xl">
      <h4 className="font-bold text-slate-800 text-sm">Adicionar Marco na Linha do Tempo</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600">Ano</label>
          <input
            type="text"
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Ex: 2026"
            className="w-full text-xs p-2 border rounded border-slate-300"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-600">Título do Marco</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Inauguração de Novo Núcleo"
            className="w-full text-xs p-2 border rounded border-slate-300"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Descrição do Marco</label>
        <textarea
          rows={2}
          required
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Detalhes históricos do evento..."
          className="w-full text-xs p-2 border rounded border-slate-300"
        />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-200 rounded"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => {
            if (!title.trim() || !desc.trim()) return;
            onAdd({ year, title, desc });
          }}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded"
        >
          Salvar Evento
        </button>
      </div>
    </div>
  );
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string[];
}

interface TimelineEvent {
  year: string;
  title: string;
  desc: string;
}

const initialTeamMembers: TeamMember[] = [
  {
    name: 'Dra. Sandra S. Ferreira Nunes',
    role: 'Consultora de Assuntos Estratégicos',
    image: '/img/04.png',
    bio: [
      'Atuação estratégica na gestão de riscos e alinhamento consultivo corporativo',
      'Assessoria em casos de alta repercussão patrimonial e estruturação de acordos',
      'Coordenação multidisciplinar em interface com auditorias externas e perícias técnicas',
    ],
  },
  {
    name: 'Dra. Liziane Luciana da S. Sucena',
    role: 'Advogada Sênior',
    image: '/img/05.png',
    bio: [
      'Larga experiência no contencioso cível, médico e empresarial nos tribunais estaduais e superiores',
      'Especialista em redação recursal refinada, sustentações orais e cumprimento de sentenças',
      'Condução de processos complexos com foco na celeridade e preservação de direitos',
    ],
  },
  {
    name: 'Dra. Paloma Duarte Costa',
    role: 'Advogada Júnior II',
    image: '/img/06.png',
    bio: [
      'Atuação focada no contencioso civil, família e contratos com rigor nos prazos processuais',
      'Acompanhamento direto de diligências, audiências e perícias técnicas judiciais',
      'Compromisso com o atendimento detalhado e a prestação de informações contínuas ao cliente',
    ],
  },
  {
    name: 'Dr. André Carneiro Fuzinato',
    role: 'Bacharel em Direito & Assistente Jurídico',
    image: '/img/03.png',
    bio: [
      'Pesquisa jurisprudencial avançada em tribunais de todo o país',
      'Elaboração de minutas de peças processuais e relatórios de inteligência forense',
      'Suporte analítico às frentes de recuperação de crédito e contratos empresariais',
    ],
  },
  {
    name: 'Andressa Aparecida Galvani',
    role: 'Secretária Executiva & Gestão de Atendimento',
    image: '/img/07.png',
    bio: [
      'Gestão da agenda de audiências, conferências e atendimentos executivos do Dr. Eduardo',
      'Primeiro ponto de contato acolhedor e humanizado com o cliente da EVI Advogados',
      'Organização administrativa e suporte ao fluxo do programa de atendimento ao cliente',
    ],
  },
];

const initialTimelineEvents: TimelineEvent[] = [
  {
    year: '2001',
    title: 'Fundação da EVI Advogados',
    desc: 'Em 02 de julho de 2001, em São Bernardo do Campo, o Dr. Eduardo Veríssimo Inocente funda a banca, unindo rigor acadêmico a uma postura combativa em defesa dos clientes.',
  },
  {
    year: '2010',
    title: 'Expansão e Nova Sede no Ipiranga',
    desc: 'Consolidação das práticas corporativas, cíveis e médicas com a transferência da sede principal para o bairro nobre e histórico do Ipiranga, em São Paulo.',
  },
  {
    year: '2018',
    title: 'Reconhecimento & Troféu Personalidade ABC',
    desc: 'O Dr. Eduardo Veríssimo Inocente é homenageado com o tradicional Troféu Personalidade ABC. Projeção nas emissoras de TV em rede nacional (SBT, Rede Brasil e programas especializados).',
  },
  {
    year: '2019',
    title: 'Prêmio QUALITY JUSTIÇA & Band News TV',
    desc: 'Outorga do cobiçado Prêmio QUALITY JUSTIÇA, chancelando a responsabilidade social e o padrão ético do escritório. Participação no programa Empresários de Sucesso na Band News.',
  },
  {
    year: '2021',
    title: 'Chancela Internacional IBI',
    desc: 'A EVI Sociedade de Advogados torna-se Membership oficial do conceituado International Business Institute (IBI), ampliando relações globais.',
  },
  {
    year: '2022',
    title: 'Capa da International Business Magazine',
    desc: 'Destaque editorial com o título “Assessoria Jurídica Moderna e Inovadora é a marca da E.V.I. Sociedade de Advogados”, evidenciando a liderança do escritório.',
  },
  {
    year: '2026',
    title: 'Jubileu de Prata: 25 Anos de Vanguarda',
    desc: 'Comemoração de 25 anos de atuação ininterrupta, modernização digital, podcast exclusivo e atendimento estratégico a clientes em todo o território nacional.',
  },
  {
    year: '2026',
    title: 'Capa da Revista Prospere',
    desc: 'O advogado que tornou sua experiência de paternidade referência para outras famílias.',
  },
];

export default function QuemSomosPage() {
  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-6xl">
          {/* 1. HERO INSTITUCIONAL: 25 ANOS DE HISTÓRIA */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <EditableText
              page="quem_somos"
              section="hero"
              fieldKey="eyebrow"
              defaultContent="25 Anos de Vanguarda Jurídica · 2001–2026"
              as="span"
              className="eyebrow justify-center mb-3"
            />
            <EditableText
              page="quem_somos"
              section="hero"
              fieldKey="title"
              defaultContent="Uma história de excelência, coragem estratégica e liderança jurídica."
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6 leading-tight"
            />
            <EditableText
              page="quem_somos"
              section="hero"
              fieldKey="desc"
              defaultContent="Fundada em 02 de julho de 2001 pelo Dr. Eduardo Veríssimo Inocente, a EVI Sociedade de Advogados consolidou-se como uma das bancas mais respeitadas do Brasil, defendendo causas determinantes com inteligência estratégica e acolhimento humano real."
              as="p"
              className="text-evi-text-light text-lg md:text-xl leading-relaxed"
              multiline
            />
          </div>

          {/* 2. PERFIL DO FUNDADOR & DIRETOR JURÍDICO (#dr-eduardo) */}
          <div id="dr-eduardo" className="bg-white rounded-3xl border border-evi-border p-8 md:p-14 shadow-evi-card mb-16 scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden border border-evi-border shadow-evi-hover group">
                  <EditableMedia
                    page="quem_somos"
                    section="dr_eduardo"
                    fieldKey="image"
                    defaultSrc="/img/01.png"
                    alt="Dr. Eduardo Veríssimo Inocente - Sócio-Fundador"
                    imgClassName="w-full h-[520px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-evi-deep/95 via-transparent to-transparent flex flex-col justify-end p-6 text-white pointer-events-none">
                    <span className="text-xs uppercase tracking-widest text-slate-300 font-semibold mb-1">
                      Sócio-Diretor & Fundador
                    </span>
                    <strong className="text-xl font-serif">Dr. Eduardo Veríssimo Inocente</strong>
                    <span className="text-xs text-slate-300">Inscrição OAB/SP 200.334 · Mestre em Direitos Difusos</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <EditableText
                  page="quem_somos"
                  section="dr_eduardo"
                  fieldKey="eyebrow"
                  defaultContent="Liderança & Trajetória"
                  as="span"
                  className="eyebrow"
                />
                <EditableText
                  page="quem_somos"
                  section="dr_eduardo"
                  fieldKey="heading"
                  defaultContent="Dr. Eduardo Veríssimo Inocente"
                  as="h2"
                  className="text-3xl md:text-4xl font-serif font-bold text-evi-deep"
                />
                <EditableText
                  page="quem_somos"
                  section="dr_eduardo"
                  fieldKey="bio_p1"
                  defaultContent="Advogado atuante há mais de duas décadas e meia, Mestre em Direitos Difusos e Coletivos com ênfase na Tutela de Interesses Individuais Homogêneos, autor do livro 'Direito das Famílias Esquematizado – Teoria e Prática Processual', ex-instrutor do Tribunal de Ética da OAB e vice-presidente da Comissão de Combate ao Exercício Ilegal da Profissão."
                  as="p"
                  className="text-base text-evi-text leading-relaxed"
                  multiline
                />
                <EditableText
                  page="quem_somos"
                  section="dr_eduardo"
                  fieldKey="bio_p2"
                  defaultContent="Sua prática destaca-se pela visão de vanguarda e sensibilidade humana: criou o programa inédito de suporte emocional com psicanálise para clientes em litígio e construiu uma advocacia respeitada por grandes redes nacionais de televisão e publicações internacionais."
                  as="p"
                  className="text-base text-evi-text-light leading-relaxed"
                  multiline
                />
                <div className="pt-2">
                  <EditableLink
                    page="quem_somos"
                    section="dr_eduardo"
                    fieldKey="cta"
                    defaultLabel="Conversar Diretamente com o Dr. Eduardo pelo WhatsApp →"
                    defaultHref="https://wa.me/5511991390045?text=Ol%C3%A1%20Dr.%20Eduardo%2C%20gostaria%20de%20uma%20orienta%C3%A7%C3%A3o%20jur%C3%ADdica."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-wa text-sm inline-block"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. FORMAÇÃO ACADÊMICA E RECONHECIMENTO */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-3xl border border-evi-border p-8 md:p-10 shadow-evi-card">
              <span className="eyebrow mb-3">Formação de Alto Nível</span>
              <EditableText
                page="quem_somos"
                section="credenciais"
                fieldKey="acad_title"
                defaultContent="Solidez Acadêmica & Docência"
                as="h2"
                className="text-2xl font-serif font-bold text-evi-deep mb-6"
              />
              <ul className="space-y-3.5 text-sm text-evi-text">
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Mestre em Direitos Difusos e Coletivos</strong>, com rigor metodológico e fundamentação científica em cada peça jurídica.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Especialista em Direito das Famílias e Sucessões</strong>, aliando sensibilidade humana a estratégias patrimoniais de alto impacto.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Professor Universitário de Direito</strong>, formando gerações de operadores jurídicos.
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl border border-evi-border p-8 md:p-10 shadow-evi-card">
              <span className="eyebrow mb-3">Atuação Institucional & Reconhecimento</span>
              <EditableText
                page="quem_somos"
                section="credenciais"
                fieldKey="rec_title"
                defaultContent="Liderança na OAB & Chancelas Oficiais"
                as="h2"
                className="text-2xl font-serif font-bold text-evi-deep mb-6"
              />
              <ul className="space-y-3.5 text-sm text-evi-text">
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Ex-Instrutor do Tribunal de Ética e Disciplina da OAB/SP</strong> (Subseção SBC).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Vice-Presidente da Comissão de Combate ao Exercício Ilegal da Profissão</strong> da OAB/SBC.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Autor do Livro</strong> “Direito das Famílias Esquematizado – Teoria e Prática Processual”.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Homenageado com o Troféu Personalidade ABC</strong> no calendário oficial de São Paulo.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-evi-accent font-bold mt-1">✔</span>
                  <div>
                    <strong>Laureado com o Prêmio QUALITY JUSTIÇA</strong> em reconhecimento ético e responsabilidade social.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* 4. DESTAQUE DA OBRA LITERÁRIA */}
          <div className="bg-evi-deep text-white rounded-3xl p-8 md:p-12 mb-16 shadow-evi-card relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs uppercase tracking-widest text-evi-silver font-semibold block">
                  Doutrina & Produção Intelectual
                </span>
                <EditableText
                  page="quem_somos"
                  section="livro"
                  fieldKey="title"
                  defaultContent="Livro: “Direito das Famílias Esquematizado – Teoria e Prática Processual”"
                  as="h3"
                  className="text-3xl font-serif font-bold leading-snug"
                />
                <EditableText
                  page="quem_somos"
                  section="livro"
                  fieldKey="desc"
                  defaultContent="Fruto de anos de magistério acadêmico e prática forense combativa, a obra do Dr. Eduardo Veríssimo Inocente sistematiza os institutos contemporâneos do Direito de Família e Sucessões, servindo como referência prática para advogados, magistrados e operadores jurídicos de todo o país."
                  as="p"
                  className="text-slate-300 text-sm md:text-base leading-relaxed"
                  multiline
                />
                <div className="pt-2">
                  <EditableLink
                    page="quem_somos"
                    section="livro"
                    fieldKey="cta"
                    defaultLabel="Conhecer Atuação em Direito de Família →"
                    defaultHref="/areas-de-atuacao"
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-evi-deep"
                  />
                </div>
              </div>
              <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center flex flex-col items-center justify-center">
                <EditableMediaOrVideo
                  page="quem_somos"
                  section="livro"
                  fieldKey="media"
                  defaultType="icon"
                  defaultIcon="📚"
                  alt="Destaque da Obra do Dr. Eduardo"
                  className="mb-3 w-full flex items-center justify-center"
                />
                <EditableText
                  page="quem_somos"
                  section="livro"
                  fieldKey="badge_title"
                  defaultContent="Referência Nacional"
                  as="strong"
                  className="text-lg font-serif block mb-1 text-white"
                />
                <EditableText
                  page="quem_somos"
                  section="livro"
                  fieldKey="badge_desc"
                  defaultContent="Teoria sólida aplicada a vitórias judiciais concretas."
                  as="p"
                  className="text-xs text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* 5. CORPO JURÍDICO & EQUIPE MULTIDISCIPLINAR COM BOTÃO DE ADICIONAR INTEGRANTE */}
          <div id="profissionais" className="mb-16 scroll-mt-24">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <EditableText
                page="quem_somos"
                section="equipe_header"
                fieldKey="eyebrow"
                defaultContent="Capital Humano de Elite"
                as="span"
                className="eyebrow justify-center mb-3"
              />
              <EditableText
                page="quem_somos"
                section="equipe_header"
                fieldKey="title"
                defaultContent="Corpo Jurídico & Equipe Multidisciplinar"
                as="h2"
                className="text-3xl md:text-4xl font-serif text-evi-deep font-bold tracking-tight mb-4"
              />
              <EditableText
                page="quem_somos"
                section="equipe_header"
                fieldKey="desc"
                defaultContent="Advogados associados, consultores e assistentes dedicados à máxima precisão técnica e ao atendimento humanizado de cada cliente."
                as="p"
                className="text-evi-text-light text-base md:text-lg leading-relaxed"
                multiline
              />
            </div>

            <EditableList<TeamMember>
              page="quem_somos"
              section="equipe"
              fieldKey="members_list"
              defaultItems={initialTeamMembers}
              addButtonLabel="+ Adicionar Novo Integrante da Equipe"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              renderItem={(member, idx, isEditing, onUpdate, onDelete) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card hover:shadow-evi-hover transition-all duration-300 group flex flex-col justify-between relative"
                >
                  {isEditing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="absolute top-3 right-3 z-50 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs px-3 py-1.5 rounded-full shadow-2xl font-semibold flex items-center gap-1.5 cursor-pointer transition-all border border-white/30"
                    >
                      Remover
                    </button>
                  )}
                  <div>
                    <div className="aspect-[4/5] w-full overflow-hidden bg-slate-100 relative">
                      <EditableMedia
                        page="quem_somos"
                        section="equipe"
                        fieldKey={`member_img_${idx}`}
                        defaultSrc={member.image}
                        alt={member.name}
                        imgClassName="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-evi-deep/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                      <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-200 block">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <EditableText
                        page="quem_somos"
                        section="equipe"
                        fieldKey={`member_name_${idx}`}
                        defaultContent={member.name}
                        as="h3"
                        className="text-xl font-serif font-bold text-evi-deep mb-4"
                      />

                      <ul className="space-y-2">
                        {member.bio.map((item, bIdx) => (
                          <li key={bIdx} className="text-xs text-evi-text-light leading-relaxed flex items-start gap-2">
                            <span className="text-evi-accent font-bold mt-0.5">•</span>
                            <EditableText
                              page="quem_somos"
                              section="equipe"
                              fieldKey={`member_bio_${idx}_${bIdx}`}
                              defaultContent={item}
                              as="span"
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <div className="pt-4 border-t border-evi-border/60 flex items-center justify-between text-xs">
                      <span className="text-evi-text-muted">Equipe EVI Advogados</span>
                      <EditableLink
                        page="quem_somos"
                        section="equipe"
                        fieldKey={`member_link_${idx}`}
                        defaultLabel="Contato →"
                        defaultHref="https://wa.me/5511991390045"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-evi-deep hover:text-evi-accent"
                      />
                    </div>
                  </div>
                </div>
              )}
              renderAddForm={(onAdd, onCancel) => (
                <AddTeamMemberForm onAdd={onAdd} onCancel={onCancel} />
              )}
            />
          </div>

          {/* 6. HISTÓRICO & LINHA DO TEMPO: 25 ANOS (#historico) COM BOTÃO DE ADICIONAR EVENTO */}
          <div id="historico" className="mb-20 scroll-mt-24">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <EditableText
                page="quem_somos"
                section="timeline_header"
                fieldKey="eyebrow"
                defaultContent="Trajetória Institucional · 2001 a 2026"
                as="span"
                className="eyebrow justify-center mb-3"
              />
              <EditableText
                page="quem_somos"
                section="timeline_header"
                fieldKey="title"
                defaultContent="25 Anos Construindo Segurança e Justiça"
                as="h2"
                className="text-3xl md:text-4xl font-serif text-evi-deep font-bold tracking-tight mb-4"
              />
              <EditableText
                page="quem_somos"
                section="timeline_header"
                fieldKey="desc"
                defaultContent="Uma linha do tempo marcada por coragem técnica, crescimento orgânico e resultados expressivos para centenas de empresas e famílias brasileiras."
                as="p"
                className="text-evi-text-light text-base md:text-lg leading-relaxed"
                multiline
              />
            </div>

            {/* Linha do Tempo Editável com Botão de Adicionar Novo Evento */}
            <div className="relative border-l-2 border-evi-accent/30 ml-4 md:ml-32 space-y-10 mb-16 pl-6 md:pl-10">
              <EditableList<TimelineEvent>
                page="quem_somos"
                section="timeline"
                fieldKey="events_list"
                defaultItems={initialTimelineEvents}
                addButtonLabel="+ Adicionar Novo Evento na Timeline"
                className="space-y-8"
                renderItem={(evt, idx, isEditing, onUpdate, onDelete) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-evi-accent group-hover:scale-125 group-hover:border-evi-deep transition-all duration-300"></div>

                    <div className="bg-white rounded-2xl border border-evi-border p-7 shadow-evi-card hover:shadow-evi-hover transition-all duration-300 relative">
                      {isEditing && (
                        <button
                          type="button"
                          onClick={onDelete}
                          className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-full shadow font-semibold"
                        >
                          Remover
                        </button>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <EditableText
                          page="quem_somos"
                          section="timeline"
                          fieldKey={`evt_year_${idx}`}
                          defaultContent={evt.year}
                          as="span"
                          className="text-2xl font-serif font-bold text-evi-deep bg-evi-soft px-3 py-0.5 rounded-lg border border-evi-border"
                        />
                        <EditableText
                          page="quem_somos"
                          section="timeline"
                          fieldKey={`evt_title_${idx}`}
                          defaultContent={evt.title}
                          as="h3"
                          className="text-xl font-serif font-bold text-evi-deep"
                        />
                      </div>
                      <EditableText
                        page="quem_somos"
                        section="timeline"
                        fieldKey={`evt_desc_${idx}`}
                        defaultContent={evt.desc}
                        as="p"
                        className="text-evi-text-light text-base leading-relaxed"
                        multiline
                      />
                    </div>
                  </div>
                )}
                renderAddForm={(onAdd, onCancel) => (
                  <AddTimelineEventForm onAdd={onAdd} onCancel={onCancel} />
                )}
              />
            </div>
          </div>

          {/* 7. PILARES ESTRATÉGICOS: MISSÃO, VISÃO E VALORES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl border border-evi-border p-8 shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent mb-6 border border-evi-border">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v18M6 8l6-2 6 2M6 8L3 14h6L6 8zm12 0l-3 6h6l-3-6zM4 21h16" />
                  </svg>
                </div>
                <EditableText
                  page="quem_somos"
                  section="mvv"
                  fieldKey="missao_title"
                  defaultContent="Missão"
                  as="h3"
                  className="text-2xl font-serif font-bold text-evi-deep mb-3"
                />
                <EditableText
                  page="quem_somos"
                  section="mvv"
                  fieldKey="missao_desc"
                  defaultContent="Oferecer soluções jurídicas contemporâneas, dinâmicas e de alto impacto, aliando rigor técnico inegociável, ética e obstinação por resultados que garantam a tranquilidade de nossos clientes."
                  as="p"
                  className="text-sm text-evi-text-light leading-relaxed"
                  multiline
                />
              </div>
              <div className="pt-6 mt-6 border-t border-evi-border/60 text-xs font-semibold text-evi-accent uppercase tracking-wider">
                Foco no Resultado & Proteção
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-evi-border p-8 shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent mb-6 border border-evi-border">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                </div>
                <EditableText
                  page="quem_somos"
                  section="mvv"
                  fieldKey="visao_title"
                  defaultContent="Visão"
                  as="h3"
                  className="text-2xl font-serif font-bold text-evi-deep mb-3"
                />
                <EditableText
                  page="quem_somos"
                  section="mvv"
                  fieldKey="visao_desc"
                  defaultContent="Consolidar-se perenemente como referência de excelência jurídica, autoridade moral e inovação processual no Brasil, sendo o parceiro definitivo para decisões críticas e momentos de transição."
                  as="p"
                  className="text-sm text-evi-text-light leading-relaxed"
                  multiline
                />
              </div>
              <div className="pt-6 mt-6 border-t border-evi-border/60 text-xs font-semibold text-evi-accent uppercase tracking-wider">
                Vanguarda & Respeito Nacional
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-evi-border p-8 shadow-evi-card hover:shadow-evi-hover transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent mb-6 border border-evi-border">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <EditableText
                  page="quem_somos"
                  section="mvv"
                  fieldKey="valores_title"
                  defaultContent="Valores"
                  as="h3"
                  className="text-2xl font-serif font-bold text-evi-deep mb-3"
                />
                <EditableText
                  page="quem_somos"
                  section="mvv"
                  fieldKey="valores_desc"
                  defaultContent="Prática jurídica pautada por ética inegociável, sigilo rigoroso e inovação contínua. Unimos rigor processual a um acolhimento humano genuíno, defendendo cada causa com lealdade e excelência artesanal."
                  as="p"
                  className="text-sm text-evi-text-light leading-relaxed mb-4"
                  multiline
                />
                <div className="grid grid-cols-2 gap-2 text-xs text-evi-deep pt-1">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-evi-accent shrink-0"></span>
                    Ética & Sigilo
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-evi-accent shrink-0"></span>
                    Rigor Técnico
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-evi-accent shrink-0"></span>
                    Apoio Humano
                  </span>
                  <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/70 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-evi-accent shrink-0"></span>
                    Multidisciplinar
                  </span>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-evi-border/60 text-xs font-semibold text-evi-accent uppercase tracking-wider">
                Compromisso com o Cliente
              </div>
            </div>
          </div>

          {/* 8. SEDE CORPORATIVA NO IPIRANGA */}
          <div className="bg-evi-deep text-white rounded-3xl p-8 md:p-14 mb-16 relative overflow-hidden shadow-evi-card">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4">
                <span className="text-xs uppercase tracking-widest text-evi-silver font-semibold block">
                  Infraestrutura de Primeiro Mundo
                </span>
                <EditableText
                  page="quem_somos"
                  section="sede"
                  fieldKey="title"
                  defaultContent="Ambiente acolhedor, sigiloso e dotado de tecnologia de ponta."
                  as="h2"
                  className="text-3xl md:text-4xl font-serif font-bold leading-snug"
                />
                <EditableText
                  page="quem_somos"
                  section="sede"
                  fieldKey="desc"
                  defaultContent="Sediada no nobre bairro do Ipiranga em São Paulo, contamos com salas de conferência climatizadas, sistemas de segurança de dados em nuvem criptografada e conectividade para atendimento remoto em tempo real para qualquer tribunal do país."
                  as="p"
                  className="text-slate-300 text-base leading-relaxed"
                  multiline
                />
                <div className="pt-2">
                  <EditableLink
                    page="quem_somos"
                    section="sede"
                    fieldKey="cta"
                    defaultLabel="Conhecer Fotos da Estrutura →"
                    defaultHref="/nossa-estrutura"
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-evi-deep"
                  />
                </div>
              </div>
              <div className="md:col-span-5 grid grid-cols-2 gap-3">
                <img
                  src="/img/estrutura/fachada.jpg"
                  alt="Fachada EVI Advogados"
                  className="rounded-xl object-cover h-36 w-full border border-white/20 shadow-md"
                />
                <img
                  src="/img/estrutura/recepcao.jpg"
                  alt="Recepção EVI Advogados"
                  className="rounded-xl object-cover h-36 w-full border border-white/20 shadow-md"
                />
                <img
                  src="/img/estrutura/lounge.jpg"
                  alt="Lounge EVI Advogados"
                  className="rounded-xl object-cover h-36 w-full border border-white/20 shadow-md"
                />
                <img
                  src="/img/estrutura/sala-reuniao.jpg"
                  alt="Sala de Reunião EVI Advogados"
                  className="rounded-xl object-cover h-36 w-full border border-white/20 shadow-md"
                />
              </div>
            </div>
          </div>

          {/* 9. CTA FINAL */}
          <div className="bg-white rounded-3xl border border-evi-border p-10 md:p-14 text-center max-w-3xl mx-auto shadow-evi-card">
            <EditableText
              page="quem_somos"
              section="cta"
              fieldKey="title"
              defaultContent="Agende uma consulta com o Dr. Eduardo Veríssimo Inocente e equipe"
              as="h3"
              className="text-3xl font-serif font-bold text-evi-deep mb-3"
            />
            <EditableText
              page="quem_somos"
              section="cta"
              fieldKey="desc"
              defaultContent="Atendimento presencial na sede do Ipiranga em São Paulo ou por videoconferência reservada com discrição incondicional."
              as="p"
              className="text-evi-text-light text-base mb-8"
              multiline
            />
            <EditableLink
              page="quem_somos"
              section="cta"
              fieldKey="wa_btn"
              defaultLabel="Falar no WhatsApp com o Dr. Eduardo Veríssimo Inocente e Equipe"
              defaultHref="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20consulta%20com%20o%20Dr.%20Eduardo%20Ver%C3%ADssimo%20Inocente%20e%20equipe."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa text-base px-8 py-4 inline-block"
            />
          </div>
        </div>
      </main>
    </>
  );
}
