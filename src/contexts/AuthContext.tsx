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
  const [primeiroCarregamento, setPrimeiroCarregamento] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
    setPrimeiroCarregamento(false);
    setMounted(true);
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Tenta pegar o token das duas formas possíveis
      const token = localStorage.getItem('auth_token') || localStorage.getItem('auth_session');
      const savedUser = localStorage.getItem('auth_user');
      
      if (!token || !savedUser) {
        setIsLoading(false);
        return;
      }

      // Se tem usuário salvo, usa ele IMEDIATAMENTE
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (e) {
        // CRÍTICO: NÃO LIMPA O LOCALSTORAGE
        // Apenas define como null e deixa o usuário fazer login novamente
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // PRIMEIRO: Salva TUDO no localStorage
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('auth_session', data.token);
        }
        
        if (data.refreshToken) {
          localStorage.setItem('refresh_token', data.refreshToken);
        }

        localStorage.setItem('auth_user', JSON.stringify(data.user));

        // SEGUNDO: Define o usuário no estado
        setUser(data.user);

        toast.success(`Bem-vindo, ${data.user.nome}!`);
        
        // TERCEIRO: Redireciona SEM setTimeout para evitar problemas
        router.push('/dashboard');
        
        return true;
      } else {
        const errorMessage = data.message || 'Erro no login';
        toast.error(errorMessage);
        return false;
      }
    } catch (error) {
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
      // Pode logar o erro, mas não precisa fazer nada aqui
    } finally {
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_session');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('refresh_token');
      toast.success('Logout realizado com sucesso');
      router.push('/login');
    }
  };

  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading: primeiroCarregamento && !user ? isLoading : false,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};