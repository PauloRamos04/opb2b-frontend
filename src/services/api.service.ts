import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export interface UpdateCellData {
  row: number;
  col: number;
  value: string;
}

export interface SpreadsheetResponse {
  success: boolean;
  data: string[][];
  timestamp: string;
}

export interface UpdateResponse {
  success: boolean;
  message: string;
  data?: {
    row: number;
    col: number;
    value: string;
  };
  timestamp: string;
}

export interface NovoChamadoData {
  operador: string;
  cliente: string;
  carteira: string;
  cidade: string;
  tecnico?: string;
  status: string;
  assunto: string;
  descricao: string;
}

export const apiService = {
  async getData(): Promise<SpreadsheetResponse> {
    try {
      const response = await api.get<SpreadsheetResponse>('/spreadsheet/data');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw new Error('Falha ao conectar com o servidor');
    }
  },

  async updateCell(data: UpdateCellData): Promise<UpdateResponse> {
    try {
      const response = await api.post<UpdateResponse>('/spreadsheet/update-cell', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar célula:', error);
      throw new Error('Falha ao atualizar célula');
    }
  },

  async criarChamado(data: NovoChamadoData): Promise<UpdateResponse> {
    try {
      const response = await api.post<UpdateResponse>('/spreadsheet/novo-chamado', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
      throw new Error('Falha ao criar novo chamado');
    }
  },

  async exportarDados(filtros?: any): Promise<Blob> {
    try {
      const response = await api.post('/spreadsheet/exportar', filtros, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw new Error('Falha ao exportar dados');
    }
  },

  async getStatus(): Promise<{ success: boolean; message: string; timestamp: string }> {
    try {
      const response = await api.get('/spreadsheet/status');
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      throw new Error('Falha ao verificar status da conexão');
    }
  }
};

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout na conexão com o servidor');
    }
    if (error.response?.status === 500) {
      throw new Error('Erro interno do servidor');
    }
    if (error.response?.status === 404) {
      throw new Error('Endpoint não encontrado');
    }
    return Promise.reject(error);
  }
);

export default api;