import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://opb2b-backend-production.up.railway.app' 
  : 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UpdateCellRequest {
  row: number;
  col: number;
  value: string;
}

export interface NovoChamadoData {
  empresa: string;
  contato: string;
  telefone: string;
  email: string;
  descricao: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
}

export const apiService = {
  async getData(): Promise<{ success: boolean; data: string[][]; message?: string }> {
    try {
      const response = await api.get('/spreadsheet/data');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw new Error('Falha ao carregar dados da planilha');
    }
  },

  async updateCell(data: UpdateCellRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/spreadsheet/update-cell', data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar célula:', error);
      throw new Error('Falha ao atualizar célula');
    }
  },

  async criarChamado(dados: NovoChamadoData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/spreadsheet/novo-chamado', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
      throw new Error('Falha ao criar novo chamado');
    }
  },

  async exportarDados(filtros: any): Promise<Blob> {
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