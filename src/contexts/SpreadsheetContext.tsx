'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api.service';
import { toast } from 'react-hot-toast';

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
  updateCell: (row: number, col: number, value: string) => Promise<void>;
  criarNovoChamado: (dados: NovoChamadoData) => Promise<void>;
  isConnected: boolean;
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

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await apiService.getStatus();
        setIsConnected(response.success);
        if (response.success) {
          toast.success('Conectado ao servidor', {
            duration: 3000,
            position: 'top-right'
          });
        }
      } catch (error) {
        setIsConnected(false);
        console.error('Erro de conexão:', error);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getData();
      
      if (response.success && response.data) {
        setData(response.data);
        console.log(`Dados carregados: ${response.data.length} linhas`);
        setIsConnected(true);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
      setIsConnected(false);
      console.error('Erro ao carregar dados:', err);
      
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-right'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCell = async (row: number, col: number, value: string) => {
    try {
      console.log(`Atualizando célula [${row}, ${col}] com valor: "${value}"`);
      
      const response = await apiService.updateCell({ row, col, value });
      console.log('Resposta do salvamento:', response);
      
      if (response.success) {
        setData(prevData => {
          const newData = [...prevData];
          if (!newData[row]) newData[row] = [];
          newData[row][col] = value;
          return newData;
        });

        toast.success('Célula atualizada com sucesso!', {
          duration: 3000,
          position: 'top-right'
        });
      } else {
        throw new Error(response.message || 'Falha ao atualizar célula');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar célula';
      console.error('Erro ao atualizar célula:', err);
      
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-right'
      });
      throw new Error(errorMessage);
    }
  };

  const criarNovoChamado = async (dados: NovoChamadoData) => {
    try {
      console.log('Criando novo chamado:', dados);
      
      const response = await apiService.criarChamado(dados);
      
      if (response.success) {
        toast.success('Novo chamado criado com sucesso!', {
          duration: 5000,
          position: 'top-right'
        });
        
        await loadData();
      } else {
        throw new Error(response.message || 'Falha ao criar chamado');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar chamado';
      console.error('Erro ao criar chamado:', err);
      
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-right'
      });
      throw new Error(errorMessage);
    }
  };

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
      }}
    >
      {children}
    </SpreadsheetContext.Provider>
  );
};