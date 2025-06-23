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
      
      const response = await apiService.getData();
      
      if (response.success && response.data) {
        setData(response.data);
        setIsConnected(true);
        toast.success(`${response.data.length} linhas carregadas`);
      } else {
        throw new Error(response.message || 'Resposta inválida do servidor');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
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
    } catch (error) {
      setIsConnected(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    checkConnection();
    loadData();
  }, [isAuthenticated, checkConnection, loadData]);

  useEffect(() => {
    const handleDataUpdate = () => {
      refreshData();
    };
    on('data-update', handleDataUpdate);
    return () => {
      off('data-update', handleDataUpdate);
    };
  }, [on, off, refreshData]);

  const updateCell = useCallback(async (row: number, col: number, value: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Usuário não autenticado');
      return { success: false, message: 'Usuário não autenticado' };
    }

    try {
      const response = await apiService.updateCell({ row, col, value });
      
      if (response.success) {
        toast.success('Célula atualizada');
        await refreshData();
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
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
      const response = await apiService.criarChamado(dados);
      
      if (response.success) {
        toast.success('Chamado criado com sucesso');
        await refreshData();
      } else {
        throw new Error(response.message || 'Erro ao criar chamado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error(`Erro: ${errorMessage}`);
      throw err;
    }
  }, [isAuthenticated, user, refreshData]);

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