import { useState } from 'react';
import { chamadoService } from '../services/chamado.service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const useChamados = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const pegarChamado = async (linha: number): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    setLoading(true);
    try {
      const response = await chamadoService.pegarChamado({
        linha,
        operador: user.operador,
      });

      if (response.success) {
        toast.success('Chamado atribuído com sucesso!');
        return true;
      } else {
        toast.error(response.message || 'Erro ao pegar chamado');
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adicionarAndamento = async (linha: number, andamento: string): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    if (!andamento.trim()) {
      toast.error('Andamento não pode estar vazio');
      return false;
    }

    setLoading(true);
    try {
      const response = await chamadoService.adicionarAndamento({
        linha,
        andamento: andamento.trim(),
        operador: user.operador,
      });

      if (response.success) {
        toast.success('Andamento adicionado com sucesso!');
        return true;
      } else {
        toast.error(response.message || 'Erro ao adicionar andamento');
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (linha: number, status: string): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    setLoading(true);
    try {
      const response = await chamadoService.atualizarStatus({
        linha,
        status,
        operador: user.operador,
      });

      if (response.success) {
        toast.success('Status atualizado com sucesso!');
        return true;
      } else {
        toast.error(response.message || 'Erro ao atualizar status');
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const finalizarChamado = async (linha: number, resolucao: string): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    if (!resolucao.trim()) {
      toast.error('Resolução não pode estar vazia');
      return false;
    }

    setLoading(true);
    try {
      const response = await chamadoService.finalizarChamado({
        linha,
        resolucao: resolucao.trim(),
        operador: user.operador,
      });

      if (response.success) {
        toast.success('Chamado finalizado com sucesso!');
        return true;
      } else {
        toast.error(response.message || 'Erro ao finalizar chamado');
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const transferirChamado = async (linha: number, operadorDestino: string, motivo: string): Promise<boolean> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return false;
    }

    if (!operadorDestino || !motivo.trim()) {
      toast.error('Operador e motivo são obrigatórios');
      return false;
    }

    setLoading(true);
    try {
      const response = await chamadoService.transferirChamado(
        linha,
        operadorDestino,
        motivo.trim()
      );

      if (response.success) {
        toast.success('Chamado transferido com sucesso!');
        return true;
      } else {
        toast.error(response.message || 'Erro ao transferir chamado');
        return false;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const buscarHistorico = async (linha: number) => {
    setLoading(true);
    try {
      const response = await chamadoService.buscarHistorico(linha);
      
      if (response.success) {
        return response.historico || [];
      } else {
        toast.error('Erro ao buscar histórico');
        return [];
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    pegarChamado,
    adicionarAndamento,
    atualizarStatus,
    finalizarChamado,
    transferirChamado,
    buscarHistorico,
  };
};