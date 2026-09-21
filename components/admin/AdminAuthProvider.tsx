'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { User } from '@supabase/supabase-js';
import AdminTopBar from './AdminTopBar';

interface AdminAuthContextType {
  user: User | null;
  isAdmin: boolean;
  isEditing: boolean;
  toggleEditMode: () => void;
  logout: () => Promise<void>;
  statusMessage: string | null;
  setStatusMessage: (msg: string | null) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  isAdmin: false,
  isEditing: false,
  toggleEditMode: () => {},
  logout: async () => {},
  statusMessage: null,
  setStatusMessage: () => {},
});

export function useAdminEditor() {
  return useContext(AdminAuthContext);
}

export default function AdminAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // 1. Verifica a sessão ativa atual no Supabase
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          setIsAdmin(true);
          // Por padrão ao estar logado, ativa o modo de edição
          setIsEditing(true);
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsEditing(false);
        }
      } catch (err) {
        console.error('Erro ao verificar sessão do administrador:', err);
      }
    };

    checkUser();

    // 2. Escuta mudanças de estado de autenticação (login, logout, refresh de token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsEditing(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setIsEditing(false);
    window.location.reload();
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAdmin,
        isEditing,
        toggleEditMode,
        logout,
        statusMessage,
        setStatusMessage,
      }}
    >
      {/* Barra superior de controle exibida quando o admin está logado */}
      {isAdmin && <AdminTopBar />}
      <div className={isAdmin ? 'pt-12 transition-all' : ''}>
        {children}
      </div>
    </AdminAuthContext.Provider>
  );
}
