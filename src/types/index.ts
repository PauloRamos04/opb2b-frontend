export interface FilterState {
  operador: string[];
  servico: string;
  status: string[];
  carteira: string[];
  cidade: string;
  tecnico: string;
  dataInicio: string;
  dataFim: string;
  buscaGeral: string;
  prioridade: string;
  cliente: string;
  assuntos: string;
  descricao: string;
  uf: string;
  regional: string;
  temRetorno: string;
  periodoRetorno: string;
  statusAndamento: string;
  valorMinimo: string;
  valorMaximo: string;
  tipoServico: string;
  origem: string;
  urgencia: string;
  responsavel: string;
  tags: string[];
}

export interface PopupData {
  aberto: boolean;
  tipo: 'detalhes' | 'novo' | '';
  dados: any;
  linha: number | null;
}

export interface FilteredDataItem {
  data: string[];
  originalIndex: number;
}

export interface NovoChamadoData {
  empresa: string;
  contato: string;
  telefone: string;
  email: string;
  descricao: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
}

export interface UpdateCellRequest {
  row: number;
  col: number;
  value: string;
}

export interface ValoresUnicos {
  operadores: string[];
  servico: string[];
  status: string[];
  carteiras: string[];
  cidades: string[];
  assuntos: string[];
  tecnicos: string[];
  clientes: string[];
  ufs: string[];
  regionais: string[];
  responsaveis: string[];
}