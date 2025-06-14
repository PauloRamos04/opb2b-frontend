'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, NovoChamadoData } from '@/services/api.service';
import { useSocket } from '@/hooks/useSocket';
import toast from 'react-hot-toast';

interface SpreadsheetContextType {
  data: string[][];
  loading: boolean;
  error: string | null;
  filters: Record<string, string[]>;
  setFilters: (filters: Record<string, string[]>) => void;
  updateCell: (row: number, col: number, value: string) => Promise<void>;
  refreshData: () => Promise<void>;
  isConnected: boolean;
  criarNovoChamado: (dados: NovoChamadoData) => Promise<void>;
  exportarDados: (filtros?: any) => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  
  const socket = useSocket(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');

  useEffect(() => {
    loadData();
    
    const interval = setInterval(() => {
      if (!loading) {
        loadData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('data-update', (newData: { values: string[][] }) => {
        console.log('Dados atualizados via socket');
        setData(newData.values);
      });

      socket.on('cell-updated', (update: { row: number; col: number; value: string }) => {
        console.log('Célula atualizada via socket:', update);
        setData(prevData => {
          const newData = [...prevData];
          if (!newData[update.row]) newData[update.row] = [];
          newData[update.row][update.col] = update.value;
          return newData;
        });
        toast.success('Célula atualizada por outro usuário', {
          duration: 3000,
          position: 'top-right'
        });
      });

      socket.on('novo-chamado', (chamado: any) => {
        console.log('Novo chamado criado via socket:', chamado);
        toast.success('Novo chamado foi criado no sistema', {
          duration: 4000,
          position: 'top-right'
        });
        loadData();
      });

      socket.on('connection-status', (status: { connected: boolean; message?: string }) => {
        if (status.connected) {
          toast.success('Reconectado ao servidor', {
            duration: 3000,
            position: 'top-right'
          });
        } else {
          toast.error('Conexão perdida com o servidor', {
            duration: 5000,
            position: 'top-right'
          });
        }
      });

      return () => {
        socket.off('data-update');
        socket.off('cell-updated');
        socket.off('novo-chamado');
        socket.off('error');
        socket.off('connection-status');
      };
    }
  }, [socket]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getData();
      
      if (response.success && response.data) {
        setData(response.data);
        console.log(`Dados carregados: ${response.data.length} linhas`);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
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

        if (socket) {
          socket.emit('update-cell', { row, col, value });
        }

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
        if (socket) {
          socket.emit('novo-chamado', dados);
        }

        toast.success('Novo chamado criado com sucesso!', {
          duration: 4000,
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
      throw err;
    }
  };

  const exportarDados = async (filtros?: any) => {
    try {
      console.log('Exportando dados com filtros:', filtros);
      
      const blob = await apiService.exportarDados(filtros);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chamados_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Dados exportados com sucesso!', {
        duration: 3000,
        position: 'top-right'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao exportar dados';
      console.error('Erro ao exportar dados:', err);
      
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-right'
      });
      throw err;
    }
  };

  const refreshData = async () => {
    console.log('Atualizando dados manualmente...');
    await loadData();
  };

  const contextValue: SpreadsheetContextType = {
    data,
    loading,
    error,
    filters,
    setFilters,
    updateCell,
    refreshData,
    isConnected: socket?.isConnected || false,
    criarNovoChamado,
    exportarDados
  };

  return (
    <SpreadsheetContext.Provider value={contextValue}>
      {children}
    </SpreadsheetContext.Provider>
  );
};

export default SpreadsheetProvider;