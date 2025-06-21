import { apiService, UpdateCellRequest } from './api.service';
import { COLUMN_INDICES } from '@/constants';

export interface PegarChamadoRequest {
  linha: number;
  operador: string;
}

export interface AdicionarAndamentoRequest {
  linha: number;
  andamento: string;
  operador: string;
}

export interface AtualizarStatusRequest {
  linha: number;
  status: string;
  operador: string;
}

export interface FinalizarChamadoRequest {
  linha: number;
  resolucao: string;
  operador: string;
}

export interface TransferirChamadoRequest {
  linha: number;
  operadorDestino: string;
  motivo: string;
}

export interface ChamadoResponse {
  success: boolean;
  message: string;
  data?: any;
  historico?: any[];
}

class ChamadoService {
  private baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://sua-api-backend.com/api' 
    : 'http://localhost:3001/api';

  private getHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  async pegarChamado(data: PegarChamadoRequest): Promise<ChamadoResponse> {
    try {
      const agora = new Date();
      const dia = agora.getDate().toString().padStart(2, '0');
      const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
      const hora = agora.getHours().toString().padStart(2, '0');
      const minutos = agora.getMinutes().toString().padStart(2, '0');
      const dataFormatada = `${dia}/${mes} ${hora}:${minutos}`;

      const updateRetorno: UpdateCellRequest = { row: data.linha, col: COLUMN_INDICES['RETORNO'], value: dataFormatada };
      const updateOperador: UpdateCellRequest = { row: data.linha, col: COLUMN_INDICES['OPERADOR'], value: data.operador };

      const [resRetorno, resOperador] = await Promise.all([
        apiService.updateCell(updateRetorno),
        apiService.updateCell(updateOperador)
      ]);

      if (!resRetorno.success || !resOperador.success) {
        throw new Error('Erro ao atualizar células de retorno ou operador');
      }
      return { success: true, message: "Chamado pego com sucesso!" };
    } catch (error) {
      console.error('Erro ao pegar chamado:', error);
      throw new Error('Falha ao pegar chamado');
    }
  }

  async adicionarAndamento(data: AdicionarAndamentoRequest & { valorAtual: string }): Promise<ChamadoResponse> {
    try {
      const timestamp = new Date().toLocaleString('pt-BR');
      const novoAndamentoCompleto = `${timestamp} - ${data.operador}: ${data.andamento}`;
      const novoValor = data.valorAtual
        ? `${data.valorAtual}\n${novoAndamentoCompleto}`
        : novoAndamentoCompleto;

      const update: UpdateCellRequest = { row: data.linha, col: COLUMN_INDICES['DESCRIÇÃO'], value: novoValor };
      const result = await apiService.updateCell(update);

      if (!result.success) {
        throw new Error(result.message || 'Erro ao adicionar andamento');
      }
      return { success: true, message: "Andamento adicionado", data: { novoValor } };
    } catch (error) {
      console.error('Erro ao adicionar andamento:', error);
      throw new Error('Falha ao adicionar andamento');
    }
  }

  async atualizarStatus(data: AtualizarStatusRequest): Promise<ChamadoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chamados/status`, {
        method: 'PUT',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw new Error('Falha ao atualizar status');
    }
  }

  async finalizarChamado(data: FinalizarChamadoRequest): Promise<ChamadoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chamados/finalizar`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao finalizar chamado:', error);
      throw new Error('Falha ao finalizar chamado');
    }
  }

  async transferirChamado(linha: number, operadorDestino: string, motivo: string): Promise<ChamadoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chamados/transferir`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          linha,
          operadorDestino,
          motivo,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao transferir chamado:', error);
      throw new Error('Falha ao transferir chamado');
    }
  }

  async buscarHistorico(linha: number): Promise<ChamadoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chamados/historico/${linha}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw new Error('Falha ao buscar histórico');
    }
  }

  async buscarChamados(filtros: any = {}, skip = 0, limit = 100): Promise<ChamadoResponse> {
    try {
      const params = new URLSearchParams();
      
      // Adicionar filtros aos parâmetros
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== undefined && filtros[key] !== null && filtros[key] !== '') {
          params.append(key, filtros[key].toString());
        }
      });
      
      params.append('skip', skip.toString());
      params.append('limit', limit.toString());

      const response = await fetch(`${this.baseUrl}/chamados?${params}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
      throw new Error('Falha ao buscar chamados');
    }
  }

  async getStatus(): Promise<ChamadoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chamados/status`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao verificar status dos chamados:', error);
      throw new Error('Falha ao verificar status dos chamados');
    }
  }

  async salvarAlteracoes(updates: UpdateCellRequest[]): Promise<void> {
    for (const update of updates) {
      const result = await apiService.updateCell(update);
      if (!result.success) {
        throw new Error(result.message || 'Erro ao atualizar célula');
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
}

export const chamadoService = new ChamadoService();
export default chamadoService;