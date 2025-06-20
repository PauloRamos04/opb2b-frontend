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
      const response = await fetch(`${this.baseUrl}/chamados/pegar`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao pegar chamado:', error);
      throw new Error('Falha ao pegar chamado');
    }
  }

  async adicionarAndamento(data: AdicionarAndamentoRequest): Promise<ChamadoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chamados/andamento`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
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
}

export const chamadoService = new ChamadoService();
export default chamadoService;