'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface SiteContentEntry {
  value: string;
  metadata?: Record<string, any>;
  contentType?: string;
}

interface SiteContentContextType {
  contents: Record<string, SiteContentEntry>;
  getContent: (page: string, section: string, fieldKey: string, fallback: string) => string;
  getContentItem: (page: string, section: string, fieldKey: string) => SiteContentEntry | undefined;
  updateContent: (
    page: string,
    section: string,
    fieldKey: string,
    value: string,
    metadata?: Record<string, any>,
    contentType?: string
  ) => void;
  refreshContents: () => Promise<void>;
  isLoading: boolean;
}

const SiteContentContext = createContext<SiteContentContextType>({
  contents: {},
  getContent: (_p, _s, _k, fallback) => fallback,
  getContentItem: () => undefined,
  updateContent: () => {},
  refreshContents: async () => {},
  isLoading: false,
});

export function useSiteContent() {
  return useContext(SiteContentContext);
}

export default function SiteContentProvider({
  children,
  initialContents = {},
}: {
  children: React.ReactNode;
  initialContents?: Record<string, SiteContentEntry>;
}) {
  const [contents, setContents] = useState<Record<string, SiteContentEntry>>(initialContents);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sincroniza se initialContents for atualizado pelo SSR
  useEffect(() => {
    if (initialContents && Object.keys(initialContents).length > 0) {
      setContents((prev) => ({ ...initialContents, ...prev }));
    }
  }, [initialContents]);

  // Busca dados mais recentes da API no cliente
  const refreshContents = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/site-contents', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.contents) {
          setContents((prev) => ({ ...prev, ...json.contents }));
        }
      }
    } catch (err) {
      console.warn('Erro ao atualizar conteúdos do site via API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Executa uma sincronização no carregamento inicial da página
  useEffect(() => {
    refreshContents();
  }, [refreshContents]);

  const getContent = useCallback(
    (page: string, section: string, fieldKey: string, fallback: string): string => {
      const key = `${page}.${section}.${fieldKey}`;
      const item = contents[key];
      if (item && item.value !== undefined && item.value !== null && item.value !== '') {
        return item.value;
      }
      return fallback;
    },
    [contents]
  );

  const getContentItem = useCallback(
    (page: string, section: string, fieldKey: string): SiteContentEntry | undefined => {
      const key = `${page}.${section}.${fieldKey}`;
      return contents[key];
    },
    [contents]
  );

  const updateContent = useCallback(
    (
      page: string,
      section: string,
      fieldKey: string,
      value: string,
      metadata?: Record<string, any>,
      contentType?: string
    ) => {
      const key = `${page}.${section}.${fieldKey}`;
      setContents((prev) => ({
        ...prev,
        [key]: {
          value,
          metadata: metadata ?? prev[key]?.metadata ?? {},
          contentType: contentType ?? prev[key]?.contentType ?? 'text',
        },
      }));
    },
    []
  );

  return (
    <SiteContentContext.Provider
      value={{
        contents,
        getContent,
        getContentItem,
        updateContent,
        refreshContents,
        isLoading,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}
