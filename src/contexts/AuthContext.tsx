'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  nome: string;
  email: string;
  operador: string;
  role: string;
  carteiras: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://opb2b-backend-production.up.railway.app/api' 
  : 'http://localhost:3001/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Iniciando verificação de autenticação...');
      
      // Tenta pegar o token das duas formas possíveis
      const token = localStorage.getItem('auth_token') || localStorage.getItem('auth_session');
      const savedUser = localStorage.getItem('auth_user');
      
      console.log('🔍 Estado atual do localStorage:', { 
        hasToken: !!token, 
        hasSavedUser: !!savedUser,
        currentPath: window.location.pathname
      });
      
      if (!token || !savedUser) {
        console.log('❌ Sem token ou usuário salvos, não autenticado');
        setIsLoading(false);
        return;
      }

      // Se tem usuário salvo, usa ele IMEDIATAMENTE
      try {
        const userData = JSON.parse(savedUser);
        console.log('👤 Definindo usuário:', userData.nome);
        setUser(userData);
        console.log('✅ Usuário autenticado automaticamente');
      } catch (e) {
        console.log('❌ Erro ao parsear usuário salvo:', e);
        // CRÍTICO: NÃO LIMPA O LOCALSTORAGE
        // Apenas define como null e deixa o usuário fazer login novamente
        setUser(null);
        console.log('⚠️ Mantendo localStorage, apenas zerando estado do usuário');
      }
    } catch (error) {
      console.error('💥 Erro ao verificar autenticação:', error);
      // CRÍTICO: NÃO LIMPA O LOCALSTORAGE EM CASO DE ERRO
      console.log('⚠️ Erro capturado, mantendo localStorage intacto');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      console.log('🔄 Iniciando login...', { email });
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📡 Resposta do login:', data);

      if (response.ok && data.success) {
        console.log('✅ Login bem-sucedido');
        
        // PRIMEIRO: Salva TUDO no localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('auth_session', data.token);
          console.log('🔑 Token salvo no localStorage');
        }
        
        if (data.refreshToken) {
          localStorage.setItem('refresh_token', data.refreshToken);
          console.log('🔄 Refresh token salvo');
        }

        localStorage.setItem('auth_user', JSON.stringify(data.user));
        console.log('👤 Dados do usuário salvos');

        // SEGUNDO: Define o usuário no estado
        setUser(data.user);
        console.log('✅ Usuário definido no estado');

        toast.success(`Bem-vindo, ${data.user.nome}!`);
        
        // TERCEIRO: Redireciona SEM setTimeout para evitar problemas
        console.log('🚀 Redirecionando para /dashboard...');
        router.push('/dashboard');
        
        return true;
      } else {
        console.error('❌ Erro no login:', data);
        const errorMessage = data.message || 'Erro no login';
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('💥 Erro de conexão no login:', error);
      toast.error('Erro de conexão com o servidor');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('auth_session');
      
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // APENAS no logout que limpa tudo
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('refresh_token');
      console.log('🧹 Dados limpos no logout');
      toast.success('Logout realizado com sucesso');
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};