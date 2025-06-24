'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const { darkMode } = useTheme();

  console.log('🛡️ ProtectedRoute:', { isAuthenticated, isLoading, hasUser: !!user });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('❌ Não autenticado, redirecionando para login...');
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading && !user) {
    // Fallback para dark mode se contexto ainda não estiver pronto
    let isDark = darkMode;
    if (typeof window !== 'undefined') {
      isDark = isDark || document.documentElement.classList.contains('dark');
    }
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-100' : 'text-gray-600'}`}>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ Bloqueando acesso, usuário não autenticado');
    return null;
  }

  console.log('✅ Usuário autenticado, permitindo acesso');
  return <>{children}</>;
};

export default ProtectedRoute;