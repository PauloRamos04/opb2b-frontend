'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { apiService } from '../services/api.service';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import { useSocket } from '@/hooks/useSocket';
import { API_BASE_URL } from '@/constants';

export interface NovoChamadoData {
  empresa: string;
  contato: string;
  telefone: string;
  email: string;
  descricao: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
}

interface SpreadsheetContextType {
  data: string[][];
  loading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  updateCell: (row: number, col: number, value: string) => Promise<{ success: boolean; message: string }>;
  criarNovoChamado: (dados: NovoChamadoData) => Promise<void>;
  isConnected: boolean;
  filters: any;
  setFilters: (filters: any) => void;
  refreshData: () => Promise<void>;
}

const SpreadsheetContext = createContext<SpreadsheetContextType | undefined>(undefined);

export const useSpreadsheet = () => {
  const context = useContext(SpreadsheetContext);
  if (!context) {
    throw new Error('useSpreadsheet must be used within a SpreadsheetProvider');
  }
  return context;
};

interface SpreadsheetProviderProps {
  children: ReactNode;
}

export const SpreadsheetProvider: React.FC<SpreadsheetProviderProps> = ({ children }) => {
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [filters, setFilters] = useState({});
  
  const { isAuthenticated, user } = useAuth();
  const { on, off } = useSocket(API_BASE_URL);

  const loadData = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Carregando dados...');
      
      const response = await apiService.getData();
      console.log('📡 Resposta da API:', response);
      
      if (response.success && response.data) {
        setData(response.data);
        console.log(`✅ Dados carregados: ${response.data.length} linhas`);
        setIsConnected(true);
        toast.success(`${response.data.length} linhas carregadas`);
      } else {
        throw new Error(response.message || 'Resposta inválida do servidor');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Erro ao carregar dados:', err);
      toast.error(`Erro: ${errorMessage}`);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const checkConnection = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiService.getStatus();
      setIsConnected(response.success);
      if (response.success) {
        console.log('✅ Conectado ao servidor');
      }
    } catch (error) {
      setIsConnected(false);
      console.error('❌ Erro de conexão:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      checkConnection();
      loadData();
      const interval = setInterval(checkConnection, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, checkConnection, loadData]);

  const updateCell = useCallback(async (row: number, col: number, value: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Usuário não autenticado');
      return { success: false, message: 'Usuário não autenticado' };
    }

    try {
      console.log(`📝 Atualizando célula [${row}, ${col}] = "${value}" por ${user.operador}`);
      const response = await apiService.updateCell({ row, col, value });
      
      if (response.success) {
        console.log('✅ Célula atualizada com sucesso');
        toast.success('Célula atualizada');
        await refreshData();
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ Erro ao atualizar célula:', err);
      toast.error(`Erro: ${errorMessage}`);
      throw err;
    }
  }, [isAuthenticated, user, refreshData]);

  const criarNovoChamado = useCallback(async (dados: NovoChamadoData) => {
    if (!isAuthenticated || !user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      console.log('📝 Criando novo chamado:', dados, 'por', user.operador);
      const response = await apiService.criarChamado(dados);
      
      if (response.success) {
        console.log('✅ Chamado criado com sucesso');
        toast.success('Chamado criado com sucesso');
        await refreshData();
      } else {
        throw new Error(response.message || 'Erro ao criar chamado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('❌ Erro ao criar chamado:', err);
      toast.error(`Erro: ${errorMessage}`);
      throw err;
    }
  }, [isAuthenticated, user, refreshData]);

  useEffect(() => {
    const handleDataUpdate = () => {
      console.log('Recebido evento de atualização do backend via socket!');
      toast.success('A planilha foi atualizada!', { duration: 2000 });
      refreshData();
    };

    on('data-update', handleDataUpdate);

    return () => {
      off('data-update', handleDataUpdate);
    };
  }, [on, off, refreshData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <SpreadsheetContext.Provider
      value={{
        data,
        loading,
        error,
        loadData,
        updateCell,
        criarNovoChamado,
        isConnected,
        filters,
        setFilters,
        refreshData
      }}
    >
      {children}
    </SpreadsheetContext.Provider>
  );
};