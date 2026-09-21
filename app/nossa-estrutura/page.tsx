'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import EditableText from '@/components/admin/EditableText';
import EditableMedia from '@/components/admin/EditableMedia';
import EditableLink from '@/components/admin/EditableLink';
import EditableList from '@/components/admin/EditableList';
import { uploadSiteMedia } from '@/lib/site-content';

interface StructureSpace {
  title: string;
  category: string;
  image: string;
  desc: string;
}

/* ─── Formulário de Adicionar Espaço (componente separado) ─── */
function AddStructureSpaceForm({ onAdd, onCancel }: { onAdd: (item: StructureSpace) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Ambiente');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('/img/estrutura/fachada.jpg');

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
      <h4 className="font-bold text-slate-800 text-sm">Adicionar Novo Card da Estrutura</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600">Título do Espaço</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Sala de Audiências Privativa"
            className="w-full text-xs p-2 border rounded border-slate-300"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600">Categoria / Destaque</label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Tecnologia & Sigilo"
            className="w-full text-xs p-2 border rounded border-slate-300"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Upload de Foto ou Vídeo</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleUpload}
          className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-sky-600 file:text-white"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Descrição Detalhada</label>
        <textarea
          rows={3}
          required
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Descreva o espaço, comodidades e diferenciais para o cliente..."
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
            if (!title.trim() || !desc.trim()) return;
            onAdd({ title, category, image, desc });
          }}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded"
        >
          Salvar Novo Espaço
        </button>
      </div>
    </div>
  );
}

const initialSpaces: StructureSpace[] = [
  {
    title: 'Fachada Institucional',
    category: 'Localização Privilegiada',
    image: '/img/estrutura/fachada.jpg',
    desc: 'Localizada no histórico e acessível bairro do Ipiranga, em São Paulo, nossa sede oferece discrição, fácil estacionamento e proximidade aos principais eixos viários da capital.',
  },
  {
    title: 'Recepção Executiva',
    category: 'Acolhimento & Primeiro Contato',
    image: '/img/estrutura/recepcao.jpg',
    desc: 'Um ambiente pensado para receber nossos clientes com cordialidade, conforto e total privacidade desde o primeiro instante.',
  },
  {
    title: 'Lounge de Espera',
    category: 'Conforto & Bem-Estar',
    image: '/img/estrutura/lounge.jpg',
    desc: 'Espaço aconchegante e reservado, garantindo uma experiência agradável e tranquila para reuniões, alinhamentos prévios e audiências.',
  },
  {
    title: 'Sala de Reuniões Estratégicas',
    category: 'Tecnologia & Decisão',
    image: '/img/estrutura/sala-reuniao.jpg',
    desc: 'Infraestrutura completa para sustentações orais, videoconferências com tribunais de todo o Brasil e sessões de negociação de alta relevância com segurança de dados.',
  },
];

export default function NossaEstruturaPage() {
  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-6xl">
          {/* Header da Página */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <EditableText
              page="nossa_estrutura"
              section="header"
              fieldKey="eyebrow"
              defaultContent="Infraestrutura & Ambiente"
              as="span"
              className="eyebrow justify-center mb-3"
            />
            <EditableText
              page="nossa_estrutura"
              section="header"
              fieldKey="title"
              defaultContent="Nossa Estrutura"
              as="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-serif text-evi-deep font-bold tracking-tight mb-6"
            />
            <EditableText
              page="nossa_estrutura"
              section="header"
              fieldKey="desc"
              defaultContent="Um ambiente moderno, agradável e acolhedor, onde o sigilo dos seus interesses e a sofisticação tecnológica caminham lado a lado."
              as="p"
              className="text-evi-text-light text-lg md:text-xl leading-relaxed"
              multiline
            />
          </div>

          {/* Lista Editável de Espaços com Fotos e Botão de Adicionar Card Completo */}
          <div className="mb-16">
            <EditableList<StructureSpace>
              page="nossa_estrutura"
              section="spaces"
              fieldKey="spaces_list"
              defaultItems={initialSpaces}
              addButtonLabel="+ Adicionar Novo Espaço / Card da Estrutura"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              renderItem={(space, idx, isEditing, onUpdate, onDelete) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-evi-border overflow-hidden shadow-evi-card hover:shadow-evi-hover transition-all duration-300 group flex flex-col justify-between relative"
                >
                  {isEditing && (
                    <button
                      type="button"
                      onClick={onDelete}
                      className="absolute top-3 right-3 z-20 bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1 rounded-full shadow font-semibold"
                    >
                      Remover Card
                    </button>
                  )}
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <EditableMedia
                        page="nossa_estrutura"
                        section="spaces"
                        fieldKey={`space_img_${idx}`}
                        defaultSrc={space.image}
                        alt={space.title}
                        imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-evi-deep/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider z-10 pointer-events-none">
                        {space.category}
                      </div>
                    </div>

                    <div className="p-8">
                      <EditableText
                        page="nossa_estrutura"
                        section="spaces"
                        fieldKey={`space_title_${idx}`}
                        defaultContent={space.title}
                        as="h2"
                        className="text-2xl font-serif font-bold text-evi-deep mb-3"
                      />
                      <EditableText
                        page="nossa_estrutura"
                        section="spaces"
                        fieldKey={`space_desc_${idx}`}
                        defaultContent={space.desc}
                        as="p"
                        className="text-evi-text-light text-base leading-relaxed"
                        multiline
                      />
                    </div>
                  </div>

                  <div className="px-8 pb-8 pt-2">
                    <div className="pt-4 border-t border-evi-border/60 flex items-center justify-between text-xs text-evi-accent font-semibold">
                      <span>EVI Sociedade de Advogados</span>
                      <span>Sede Própria · São Paulo</span>
                    </div>
                  </div>
                </div>
              )}
              renderAddForm={(onAdd, onCancel) => (
                <AddStructureSpaceForm onAdd={onAdd} onCancel={onCancel} />
              )}
            />
          </div>

          {/* Destaque de Tecnologia e Segurança */}
          <div className="bg-white rounded-3xl border border-evi-border p-8 md:p-12 shadow-evi-card mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent font-bold">
                  01
                </div>
                <EditableText
                  page="nossa_estrutura"
                  section="highlights"
                  fieldKey="h1_title"
                  defaultContent="Sigilo e Compliance"
                  as="h3"
                  className="text-xl font-serif font-bold text-evi-deep"
                />
                <EditableText
                  page="nossa_estrutura"
                  section="highlights"
                  fieldKey="h1_desc"
                  defaultContent="Salas com tratamento acústico para preservação do sigilo profissional indispensável em litígios societários, familiares e negociações de risco."
                  as="p"
                  className="text-sm text-evi-text-light leading-relaxed"
                  multiline
                />
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent font-bold">
                  02
                </div>
                <EditableText
                  page="nossa_estrutura"
                  section="highlights"
                  fieldKey="h2_title"
                  defaultContent="Conectividade Nacional"
                  as="h3"
                  className="text-xl font-serif font-bold text-evi-deep"
                />
                <EditableText
                  page="nossa_estrutura"
                  section="highlights"
                  fieldKey="h2_desc"
                  defaultContent="Plataformas digitais seguras com fibra ótica redundante para audiências telepresenciais e atendimento imediato a clientes de qualquer região do Brasil."
                  as="p"
                  className="text-sm text-evi-text-light leading-relaxed"
                  multiline
                />
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-evi-soft flex items-center justify-center text-evi-accent font-bold">
                  03
                </div>
                <EditableText
                  page="nossa_estrutura"
                  section="highlights"
                  fieldKey="h3_title"
                  defaultContent="Conforto e Humanização"
                  as="h3"
                  className="text-xl font-serif font-bold text-evi-deep"
                />
                <EditableText
                  page="nossa_estrutura"
                  section="highlights"
                  fieldKey="h3_desc"
                  defaultContent="Espaços projetados para desmistificar a frieza dos escritórios convencionais, proporcionando uma experiência de real apoio e bem-estar."
                  as="p"
                  className="text-sm text-evi-text-light leading-relaxed"
                  multiline
                />
              </div>
            </div>
          </div>

          {/* Agendamento Presencial / Virtual */}
          <div className="bg-gradient-to-br from-evi-deep to-[#243d56] text-white rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-evi-card">
            <EditableText
              page="nossa_estrutura"
              section="cta"
              fieldKey="title"
              defaultContent="Venha tomar um café conosco ou agende sua conferência online"
              as="h3"
              className="text-3xl font-serif font-bold mb-4"
            />
            <EditableText
              page="nossa_estrutura"
              section="cta"
              fieldKey="desc"
              defaultContent="Rua Costa Aguiar, nº 2432 — Ipiranga, São Paulo – SP. Atendemos presencialmente com agendamento prévio ou por videoconferência com a mesma proximidade."
              as="p"
              className="text-slate-300 max-w-2xl mx-auto mb-8 text-base"
              multiline
            />
            <div className="flex flex-wrap justify-center gap-4">
              <EditableLink
                page="nossa_estrutura"
                section="cta"
                fieldKey="wa_btn"
                defaultLabel="Agendar Reunião pelo WhatsApp"
                defaultHref="https://wa.me/5511991390045?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20visita%20ou%20reuni%C3%A3o%20na%20sede%20da%20EVI."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa text-base"
              />
              <EditableLink
                page="nossa_estrutura"
                section="cta"
                fieldKey="contact_btn"
                defaultLabel="Como Chegar & Contatos"
                defaultHref="/contato"
                className="btn btn-outline border-white text-white hover:bg-white hover:text-evi-deep"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
