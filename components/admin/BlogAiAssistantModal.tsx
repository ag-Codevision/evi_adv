'use client';

import React, { useState, useEffect } from 'react';
import { useAdminEditor } from './AdminAuthProvider';
import {
  BlogAiConfig,
  getBlogAiConfig,
  saveBlogAiConfig,
  generateArticleNow,
} from '../../lib/blog-ai-actions';
import {
  Sparkles,
  Bot,
  Brain,
  Calendar,
  Clock,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Zap,
  Tag,
  AlertTriangle,
  Play
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';

interface BlogAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleGenerated?: () => void;
}

const DAYS_OF_WEEK = [
  { id: 0, label: 'Dom', fullName: 'Domingo' },
  { id: 1, label: 'Seg', fullName: 'Segunda-feira' },
  { id: 2, label: 'Ter', fullName: 'Terça-feira' },
  { id: 3, label: 'Qua', fullName: 'Quarta-feira' },
  { id: 4, label: 'Qui', fullName: 'Quinta-feira' },
  { id: 5, label: 'Sex', fullName: 'Sexta-feira' },
  { id: 6, label: 'Sáb', fullName: 'Sábado' },
];

export default function BlogAiAssistantModal({
  isOpen,
  onClose,
  onArticleGenerated,
}: BlogAiAssistantModalProps) {
  const { setStatusMessage } = useAdminEditor();

  const [activeTab, setActiveTab] = useState<'schedule' | 'brain' | 'generate'>('schedule');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingNow, setGeneratingNow] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estados de Configuração
  const [enabled, setEnabled] = useState(true);
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 4]); // Segundas e Quintas
  const [publishHour, setPublishHour] = useState<number>(19); // 19h
  const [articlesPerCycle, setArticlesPerCycle] = useState<number>(1);

  // Mini Cérebro (Categorias & Temas)
  const [customThemes, setCustomThemes] = useState<string[]>([]);
  const [newTheme, setNewTheme] = useState('');
  const [categories, setCategories] = useState<
    Array<{ slug: string; name: string; targetAudience?: string; keywords?: string[] }>
  >([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatKeywords, setNewCatKeywords] = useState('');

  // Disparo manual imediato
  const [manualTheme, setManualTheme] = useState('');
  const [manualCategory, setManualCategory] = useState('');

  // Carrega configuração salva
  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const cfg = await getBlogAiConfig();
      setEnabled(cfg.enabled);
      setSelectedDays(cfg.daysOfWeek || [1, 4]);
      setPublishHour(cfg.publishHour || 19);
      setArticlesPerCycle(cfg.articlesPerCycle || 1);
      setCustomThemes(cfg.customThemes || []);
      setCategories(cfg.categories || []);
      if (cfg.categories && cfg.categories.length > 0) {
        setManualCategory(cfg.categories[0].slug);
      }
    } catch (err: any) {
      setError('Erro ao carregar configurações de IA.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDay = (dayId: number) => {
    if (selectedDays.includes(dayId)) {
      if (selectedDays.length === 1) {
        return; // Pelo menos um dia deve estar selecionado
      }
      setSelectedDays(selectedDays.filter((d) => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId].sort());
    }
  };

  const handleAddTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheme.trim()) return;
    setCustomThemes((prev) => [...prev, newTheme.trim()]);
    setNewTheme('');
  };

  const handleRemoveTheme = (index: number) => {
    setCustomThemes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug =
      newCatSlug.trim() ||
      newCatName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    const keywords = newCatKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    setCategories((prev) => [
      ...prev,
      {
        name: newCatName.trim(),
        slug,
        keywords,
        targetAudience: 'Empresários, produtores rurais e diretores',
      },
    ]);

    setNewCatName('');
    setNewCatSlug('');
    setNewCatKeywords('');
  };

  const handleRemoveCategory = (slug: string) => {
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    setError(null);
    setStatusMessage('Salvando parâmetros do Assistente de IA...');

    const res = await saveBlogAiConfig({
      enabled,
      frequency: 'weekly',
      daysOfWeek: selectedDays,
      publishHour,
      articlesPerCycle,
      categories,
      customThemes,
    });

    setSaving(false);

    if (res.success) {
      setSuccessMessage('Configurações do Robô de IA salvas com sucesso!');
      setStatusMessage(null);
      setTimeout(() => setSuccessMessage(null), 3500);
    } else {
      setError(res.error || 'Falha ao salvar configurações.');
      setStatusMessage(null);
    }
  };

  const handleGenerateNow = async () => {
    setGeneratingNow(true);
    setError(null);
    setStatusMessage('Criando artigo com IA e selecionando fotos do Unsplash...');

    const res = await generateArticleNow(manualCategory, manualTheme);

    setGeneratingNow(false);

    if (res.success) {
      setSuccessMessage(`Artigo publicado com sucesso! "${res.article?.title}"`);
      setStatusMessage(null);
      if (onArticleGenerated) {
        onArticleGenerated();
      }
      setTimeout(() => {
        setSuccessMessage(null);
        window.location.reload();
      }, 2500);
    } else {
      setError(res.error || 'Falha ao gerar artigo.');
      setStatusMessage(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto font-sans">
      <div className="bg-[#0b1320] border border-slate-700/80 text-slate-100 rounded-3xl w-full max-w-5xl my-auto shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh]">
        {/* Header Fixo */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-sky-900/30 border border-sky-400/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-serif font-bold text-white leading-tight">
                  Assistente de IA & Automação Editorial
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ROBOT . ON
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Gere e programe a publicação de artigos com a persona do Dr. Eduardo Veríssimo e curadoria de fotos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={generatingNow}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title={generatingNow ? 'Aguarde a IA concluir a geração do artigo...' : 'Fechar'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-800 bg-slate-900/40 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2.5 font-semibold border-b-2 transition-colors ${
              activeTab === 'schedule'
                ? 'border-sky-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Agendamento & Frequência</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brain')}
            className={`flex items-center gap-2 px-4 py-2.5 font-semibold border-b-2 transition-colors ${
              activeTab === 'brain'
                ? 'border-sky-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>Mini Cérebro (Temas & Categorias)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-4 py-2.5 font-semibold border-b-2 transition-colors ${
              activeTab === 'generate'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Criar Agora com IA (Teste Imediato)</span>
          </button>
        </div>

        {/* Corpo com Scroll */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm flex-1 custom-scrollbar">
          {successMessage && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-950/80 border border-red-500/50 rounded-2xl text-red-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
              <p className="text-xs text-slate-400">Carregando configurações de inteligência artificial...</p>
            </div>
          ) : (
            <>
              {/* ABA 1: AGENDAMENTO E FREQUÊNCIA */}
              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  {/* Status Geral da Automação */}
                  <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">Robô de Publicação Automática</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                          }`}
                        />
                      </div>
                      <p className="text-xs text-slate-400">
                        Quando ativado, o robô do GitHub Actions cria e publica artigos automaticamente nos dias e horários selecionados.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      <span className="ml-3 text-xs font-semibold text-white">
                        {enabled ? 'Modo Automático Ativo' : 'Pausado'}
                      </span>
                    </label>
                  </div>

                  {/* Seleção de Dias da Semana */}
                  <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Dias da Semana para Publicação
                    </label>
                    <p className="text-xs text-slate-400">
                      Selecione em quais dias o robô deverá gerar e lançar novos artigos no blog:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 pt-2">
                      {DAYS_OF_WEEK.map((day) => {
                        const isSelected = selectedDays.includes(day.id);
                        return (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => handleToggleDay(day.id)}
                            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                              isSelected
                                ? 'bg-sky-600/30 border-sky-400 text-white shadow-md shadow-sky-950/40'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            <span className="text-xs font-bold uppercase tracking-wider">{day.label}</span>
                            <span className="text-[10px] text-slate-400">{day.fullName}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Horário de Publicação & Quantidade */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Horário de Disparo (Horário de Brasília)
                        </label>
                      </div>
                      <p className="text-xs text-slate-400">
                        Exemplo: 19h (todas as segundas e quintas às 19:00).
                      </p>
                      <select
                        value={publishHour}
                        onChange={(e) => setPublishHour(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-sky-500"
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                          <option key={h} value={h}>
                            {String(h).padStart(2, '0')}:00 horas ({h >= 12 ? 'Tarde/Noite' : 'Manhã'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Volume por Ciclo
                        </label>
                      </div>
                      <p className="text-xs text-slate-400">
                        Quantos artigos devem ser redigidos por ciclo agendado:
                      </p>
                      <select
                        value={articlesPerCycle}
                        onChange={(e) => setArticlesPerCycle(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:border-sky-500"
                      >
                        <option value={1}>1 Artigo por dia agendado (Recomendado)</option>
                        <option value={2}>2 Artigos por dia agendado</option>
                        <option value={3}>3 Artigos por dia agendado</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 2: MINI CÉREBRO (SUGESTÕES E CATEGORIAS) */}
              {activeTab === 'brain' && (
                <div className="space-y-6">
                  {/* Alimentar com Sugestões de Temas */}
                  <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                          <Brain className="w-4 h-4 text-indigo-400" />
                          Banco de Sugestões de Temas (Mini Cérebro)
                        </h4>
                        <p className="text-xs text-slate-400">
                          Adicione tópicos, teses ou pautas de interesse para que o robô crie títulos, textos e selecione imagens automaticamente.
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-950/70 text-indigo-300 border border-indigo-800/80 rounded-xl">
                        {customThemes.length} Temas Cadastrados
                      </span>
                    </div>

                    <form onSubmit={handleAddTheme} className="flex gap-2">
                      <input
                        type="text"
                        value={newTheme}
                        onChange={(e) => setNewTheme(e.target.value)}
                        placeholder="Ex: Como proteger o produtor rural contra a execução de CPR em anos de quebra de safra"
                        className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Adicionar Tema</span>
                      </button>
                    </form>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {customThemes.map((theme, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs"
                        >
                          <span className="text-slate-200 leading-relaxed font-medium">
                            💡 {theme}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTheme(idx)}
                            className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                            title="Remover tema"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categorias & Eixos Editoriais */}
                  <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                          <Tag className="w-4 h-4 text-sky-400" />
                          Eixos & Categorias Editoriais
                        </h4>
                        <p className="text-xs text-slate-400">
                          O robô alternará entre estas categorias, pesquisando imagens temáticas de alta resolução no Unsplash para a capa e 2 imagens no corpo.
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-sky-950/70 text-sky-300 border border-sky-800/80 rounded-xl">
                        {categories.length} Categorias
                      </span>
                    </div>

                    <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-12 gap-2">
                      <input
                        type="text"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="Nome da categoria (Ex: Direito Digital & IA)"
                        className="md:col-span-5 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-sky-500"
                      />
                      <input
                        type="text"
                        value={newCatKeywords}
                        onChange={(e) => setNewCatKeywords(e.target.value)}
                        placeholder="Palavras-chave separadas por vírgula"
                        className="md:col-span-5 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-sky-500"
                      />
                      <button
                        type="submit"
                        className="md:col-span-2 flex items-center justify-center gap-1 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Cadastrar</span>
                      </button>
                    </form>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {categories.map((cat) => (
                        <div
                          key={cat.slug}
                          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-white block">
                              {cat.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              slug: {cat.slug}
                            </span>
                            {cat.keywords && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {cat.keywords.slice(0, 3).map((kw, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.5 bg-slate-800 text-[9px] text-slate-300 rounded"
                                  >
                                    #{kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(cat.slug)}
                            className="text-slate-500 hover:text-red-400 p-1"
                            title="Remover categoria"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 3: CRIAR AGORA COM IA (TESTE IMEDIATO) */}
              {activeTab === 'generate' && (
                <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-5">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white flex items-center gap-2 font-serif">
                      <Zap className="w-5 h-5 text-amber-400" />
                      Publicação Imediata com Assistente de IA
                    </h4>
                    <p className="text-xs text-slate-400">
                      Deseja criar um artigo agora sem esperar o cron agendado? A IA redigirá a matéria completa com fundamentação técnica e buscará automaticamente 1 foto de capa e 2 fotos ilustrativas de alta resolução no Unsplash.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Eixo / Categoria Alvo
                      </label>
                      <select
                        value={manualCategory}
                        onChange={(e) => setManualCategory(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-emerald-500"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Tema Específico ou Pergunta Jurídica (Opcional)
                      </label>
                      <input
                        type="text"
                        value={manualTheme}
                        onChange={(e) => setManualTheme(e.target.value)}
                        placeholder="Deixe em branco para o robô sortear uma pauta estratégica do seu mini cérebro..."
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-emerald-500"
                      />
                    </div>

                    <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                      <p className="text-xs text-emerald-200">
                        O motor editorial irá selecionar imagens de alta resolução relacionadas ao tema no banco de imagens gratuito (Unsplash) para a capa e incluirá 2 imagens integradas ao corpo do texto.
                      </p>
                    </div>

                    {/* Aviso Importante sobre manter o modal aberto no teste imediato */}
                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs">
                        <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                          <span>Atenção: Mantenha este modal aberto durante a geração</span>
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                            ~20 a 40s
                          </span>
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Neste modo de <strong>teste imediato</strong>, a IA redige o artigo e faz o download das imagens em tempo real. <strong>Permaneça com esta janela aberta até a conclusão</strong> para que a página seja atualizada automaticamente com o novo artigo publicado.
                        </p>
                        <p className="text-slate-400 text-[10px]">
                          💡 <em>No modo automático (agendamento por robô/cron), você não precisa deixar nada aberto.</em>
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 space-y-3">
                      <button
                        type="button"
                        onClick={handleGenerateNow}
                        disabled={generatingNow}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-emerald-950/40 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {generatingNow ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Redigindo Artigo e Selecionando Imagens...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-white" />
                            <span>Gerar e Publicar Artigo Imediatamente</span>
                          </>
                        )}
                      </button>

                      {/* Status de processamento ativo com alerta */}
                      {generatingNow && (
                        <div className="p-3.5 bg-sky-950/80 border border-sky-500/40 rounded-xl flex items-center gap-3 animate-pulse">
                          <Loader2 className="w-5 h-5 text-sky-400 animate-spin shrink-0" />
                          <div className="text-xs text-sky-200">
                            <strong className="block text-white font-semibold">
                              Robô de IA trabalhando em tempo real...
                            </strong>
                            <span className="text-[11px]">
                              Por favor, <strong>não feche este modal</strong>. O artigo está sendo gravado no banco de dados e a página atualizará em instantes.
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Rodapé Fixo */}
        <div className="px-6 py-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4 sticky bottom-0 z-30">
          <div className="text-xs text-slate-400">
            {selectedDays.length} dias selecionados • Horário: {publishHour}:00h (Brasília)
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={generatingNow}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title={generatingNow ? 'Aguarde a IA concluir a geração do artigo...' : 'Fechar'}
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={saving || generatingNow}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-900/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Salvar Configurações da IA</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
