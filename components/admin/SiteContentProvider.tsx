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

// Mapeamento bidirecional de contatos e redes sociais para atualização em tempo real em todas as páginas
const CONTACT_ALIASES: Record<string, string[]> = {
  'global.contact.phone': ['global.footer.phone', 'global.header.phone', 'global.topbar.phone', 'contato.telefones.tel1', 'home.contact.phone'],
  'global.footer.phone': ['global.contact.phone', 'global.header.phone', 'global.topbar.phone', 'contato.telefones.tel1', 'home.contact.phone'],
  'global.header.phone': ['global.contact.phone', 'global.footer.phone', 'global.topbar.phone', 'contato.telefones.tel1', 'home.contact.phone'],
  'global.topbar.phone': ['global.contact.phone', 'global.footer.phone', 'global.header.phone', 'contato.telefones.tel1', 'home.contact.phone'],
  'contato.telefones.tel1': ['global.contact.phone', 'global.footer.phone', 'global.header.phone', 'global.topbar.phone', 'home.contact.phone'],
  'home.contact.phone': ['global.contact.phone', 'global.footer.phone', 'global.header.phone', 'global.topbar.phone', 'contato.telefones.tel1'],

  'global.contact.phone_2': ['global.footer.phone_2', 'global.header.phone_2', 'contato.telefones.tel2'],
  'global.footer.phone_2': ['global.contact.phone_2', 'global.header.phone_2', 'contato.telefones.tel2'],
  'global.header.phone_2': ['global.contact.phone_2', 'global.footer.phone_2', 'contato.telefones.tel2'],
  'contato.telefones.tel2': ['global.contact.phone_2', 'global.footer.phone_2', 'global.header.phone_2'],

  'global.contact.phone_3': ['global.footer.phone_3', 'global.header.phone_3', 'contato.telefones.tel3'],
  'global.footer.phone_3': ['global.contact.phone_3', 'global.header.phone_3', 'contato.telefones.tel3'],
  'global.header.phone_3': ['global.contact.phone_3', 'global.footer.phone_3', 'contato.telefones.tel3'],
  'contato.telefones.tel3': ['global.contact.phone_3', 'global.footer.phone_3', 'global.header.phone_3'],

  'global.contact.whatsapp': ['contato.telefones.whatsapp', 'global.header.wa_link'],
  'contato.telefones.whatsapp': ['global.contact.whatsapp', 'global.header.wa_link'],

  'global.contact.email': ['global.footer.email', 'global.header.email', 'global.topbar.email', 'contato.email.email'],
  'global.footer.email': ['global.contact.email', 'global.header.email', 'global.topbar.email', 'contato.email.email'],
  'global.header.email': ['global.contact.email', 'global.footer.email', 'global.topbar.email', 'contato.email.email'],
  'global.topbar.email': ['global.contact.email', 'global.footer.email', 'global.header.email', 'contato.email.email'],
  'contato.email.email': ['global.contact.email', 'global.footer.email', 'global.header.email', 'global.topbar.email'],

  'global.contact.social_facebook': ['global.footer.social_facebook', 'global.topbar.social_facebook', 'global.header.social_facebook', 'contato.social.facebook'],
  'global.footer.social_facebook': ['global.contact.social_facebook', 'global.topbar.social_facebook', 'global.header.social_facebook', 'contato.social.facebook'],
  'global.topbar.social_facebook': ['global.contact.social_facebook', 'global.footer.social_facebook', 'global.header.social_facebook', 'contato.social.facebook'],
  'global.header.social_facebook': ['global.contact.social_facebook', 'global.footer.social_facebook', 'global.topbar.social_facebook', 'contato.social.facebook'],
  'contato.social.facebook': ['global.contact.social_facebook', 'global.footer.social_facebook', 'global.topbar.social_facebook', 'global.header.social_facebook'],

  'global.contact.social_instagram': ['global.footer.social_instagram', 'global.topbar.social_instagram', 'global.header.social_instagram', 'contato.social.instagram'],
  'global.footer.social_instagram': ['global.contact.social_instagram', 'global.topbar.social_instagram', 'global.header.social_instagram', 'contato.social.instagram'],
  'global.topbar.social_instagram': ['global.contact.social_instagram', 'global.footer.social_instagram', 'global.header.social_instagram', 'contato.social.instagram'],
  'global.header.social_instagram': ['global.contact.social_instagram', 'global.footer.social_instagram', 'global.topbar.social_instagram', 'contato.social.instagram'],
  'contato.social.instagram': ['global.contact.social_instagram', 'global.footer.social_instagram', 'global.topbar.social_instagram', 'global.header.social_instagram'],

  'global.contact.social_linkedin': ['global.footer.social_linkedin', 'global.topbar.social_linkedin', 'global.header.social_linkedin', 'contato.social.linkedin'],
  'global.footer.social_linkedin': ['global.contact.social_linkedin', 'global.topbar.social_linkedin', 'global.header.social_linkedin', 'contato.social.linkedin'],
  'global.topbar.social_linkedin': ['global.contact.social_linkedin', 'global.footer.social_linkedin', 'global.header.social_linkedin', 'contato.social.linkedin'],
  'global.header.social_linkedin': ['global.contact.social_linkedin', 'global.footer.social_linkedin', 'global.topbar.social_linkedin', 'contato.social.linkedin'],
  'contato.social.linkedin': ['global.contact.social_linkedin', 'global.footer.social_linkedin', 'global.topbar.social_linkedin', 'global.header.social_linkedin'],

  'global.contact.social_youtube': ['global.footer.social_youtube', 'global.topbar.social_youtube', 'global.header.social_youtube', 'contato.social.youtube'],
  'global.footer.social_youtube': ['global.contact.social_youtube', 'global.topbar.social_youtube', 'global.header.social_youtube', 'contato.social.youtube'],
  'global.topbar.social_youtube': ['global.contact.social_youtube', 'global.footer.social_youtube', 'global.header.social_youtube', 'contato.social.youtube'],
  'global.header.social_youtube': ['global.contact.social_youtube', 'global.footer.social_youtube', 'global.topbar.social_youtube', 'contato.social.youtube'],
  'contato.social.youtube': ['global.contact.social_youtube', 'global.footer.social_youtube', 'global.topbar.social_youtube', 'global.header.social_youtube'],
};

  const getContent = useCallback(
    (page: string, section: string, fieldKey: string, fallback: string): string => {
      const key = `${page}.${section}.${fieldKey}`;
      const item = contents[key];
      if (item && item.value !== undefined && item.value !== null && item.value !== '') {
        return item.value;
      }

      // Se a chave direta não tiver valor, busca nos aliases mapeados
      const aliases = CONTACT_ALIASES[key];
      if (aliases) {
        for (const aliasKey of aliases) {
          const aliasItem = contents[aliasKey];
          if (aliasItem && aliasItem.value !== undefined && aliasItem.value !== null && aliasItem.value !== '') {
            return aliasItem.value;
          }
        }
      }

      return fallback;
    },
    [contents]
  );

  const getContentItem = useCallback(
    (page: string, section: string, fieldKey: string): SiteContentEntry | undefined => {
      const key = `${page}.${section}.${fieldKey}`;
      const item = contents[key];
      if (item) {
        return item;
      }

      // Se a chave direta não existir, busca nos aliases mapeados
      const aliases = CONTACT_ALIASES[key];
      if (aliases) {
        for (const aliasKey of aliases) {
          const aliasItem = contents[aliasKey];
          if (aliasItem) {
            return aliasItem;
          }
        }
      }

      return undefined;
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
      const aliases = CONTACT_ALIASES[key] || [];

      setContents((prev) => {
        const next = { ...prev };
        const newEntry = {
          value,
          metadata: metadata ?? prev[key]?.metadata ?? {},
          contentType: contentType ?? prev[key]?.contentType ?? 'text',
        };

        next[key] = newEntry;

        // Atualiza instantaneamente todos os aliases correspondentes para sincronização em tempo real
        aliases.forEach((aliasKey) => {
          next[aliasKey] = {
            value,
            metadata: metadata ?? prev[aliasKey]?.metadata ?? newEntry.metadata,
            contentType: contentType ?? prev[aliasKey]?.contentType ?? newEntry.contentType,
          };
        });

        return next;
      });
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
