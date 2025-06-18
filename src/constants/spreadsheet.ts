export const OPERADOR_LIST = [
  'B2B | Dione',
  'B2B | Gustavo',
  'B2B | Jessica',
  'B2B | Leonardo',
  'B2B | Matheus',
  'B2B | Nickolas',
  'B2B | Paulo F',
  'B2B | Raphael',
  'B2B | Yan',
  'LIVRE',
  'S.I | Matheus',
  'S.I | Mosca'
];

export const STATUS_LIST = [
  'EM ANÁLISE',
  'FINALIZADO',
  'AGENDADA',
  'EM ATD - USO',
  'ANULADA',
  'FINALIZADO / VT',
  'SEM CONTATO #UD',
  'SEM CONTATO 2',
  'SEM CONTATO 3',
  'AGUARDANDO - NOC',
  'AGUARDANDO - ENGENHARIA',
  'AGUARDANDO - TI',
  'AGUARDANDO - TELEFONIA',
  'AGUARDANDO - REDE EXTERNA',
  'AGUARDANDO - OPERAÇÕES B2B'
];

export const CARTEIRAS_LIST = [
  'ALEGRA',
  'CABOTELECOM',
  'CORTEZ',
  'CONEXÃO',
  'DIRETA',
  'IP3',
  'MEGA',
  'MULTIPLAY',
  'NETVGA',
  'NOWTECH',
  'OUTCENTER',
  'RESENDENET',
  'SAPUCAINET',
  'STARWEB',
  'TECNET',
  'WAYNET',
  'WEBNET',
  'WEBBY',
  'AZZA'
];

export const STATUS_CLASSES = {
  'EM ANÁLISE': 'bg-orange-500 text-white',
  'FINALIZADO': 'bg-green-500 text-white',
  'AGENDADA': 'bg-blue-500 text-white',
  'EM ATD - USO': 'bg-emerald-500 text-white',
  'ANULADA': 'bg-gray-500 text-white',
  'FINALIZADO / VT': 'bg-teal-600 text-white',
  'SEM CONTATO #UD': 'bg-red-500 text-white',
  'SEM CONTATO 2': 'bg-red-600 text-white',
  'SEM CONTATO 3': 'bg-red-700 text-white',
  'AGUARDANDO - NOC': 'bg-indigo-500 text-white',
  'AGUARDANDO - ENGENHARIA': 'bg-purple-500 text-white',
  'AGUARDANDO - TI': 'bg-teal-500 text-white',
  'AGUARDANDO - TELEFONIA': 'bg-cyan-500 text-white',
  'AGUARDANDO - REDE EXTERNA': 'bg-lime-500 text-black',
  'AGUARDANDO - OPERAÇÕES B2B': 'bg-yellow-500 text-black'
};

export const OPERADOR_CLASSES = {
  'B2B | Dione': 'bg-red-400 text-white',
  'B2B | Gustavo': 'bg-red-400 text-white',
  'B2B | Jessica': 'bg-red-400 text-white',
  'B2B | Leonardo': 'bg-red-400 text-white',
  'B2B | Matheus': 'bg-red-400 text-white',
  'B2B | Nickolas': 'bg-red-400 text-white',
  'B2B | Paulo F': 'bg-red-400 text-white',
  'B2B | Raphael': 'bg-red-400 text-white',
  'B2B | Yan': 'bg-red-400 text-white',
  'LIVRE': 'bg-red-400 text-white',
  'S.I | Matheus': 'bg-red-400 text-white',
  'S.I | Mosca': 'bg-red-400 text-white'
};

export const CARTEIRA_CLASSES = {
  'ALEGRA': 'bg-red-400 text-white',
  'CABOTELECOM': 'bg-teal-400 text-white',
  'CORTEZ': 'bg-blue-400 text-white',
  'CONEXÃO': 'bg-orange-300 text-white',
  'DIRETA': 'bg-green-300 text-white',
  'IP3': 'bg-pink-400 text-white',
  'MEGA': 'bg-indigo-400 text-white',
  'MULTIPLAY': 'bg-purple-400 text-white',
  'NETVGA': 'bg-blue-300 text-white',
  'NOWTECH': 'bg-teal-300 text-white',
  'OUTCENTER': 'bg-green-400 text-white',
  'RESENDENET': 'bg-yellow-300 text-black',
  'SAPUCAINET': 'bg-orange-400 text-white',
  'STARWEB': 'bg-amber-400 text-white',
  'TECNET': 'bg-gray-400 text-white',
  'WAYNET': 'bg-red-300 text-white',
  'WEBNET': 'bg-cyan-400 text-white',
  'WEBBY': 'bg-green-300 text-white',
  'AZZA': 'bg-cyan-400 text-black'
};

export const TABLE_COLUMN_ORDER = [
  'OPERADOR',
  'Histórico',
  'SERVIÇO',
  'STATUS',
  'RETORNO',
  'ASSUNTO',
  'CARTEIRA',
  'CIDADE',
  'TEC',
  'DESCRIÇÃO',
  'DATA ABERTURA',
  'H_RETORNO',
  'RESOLUÇÃO BO:',
  'CLIENTE',
  'UF',
  'REGIONAL',
  'ÚLTIMA EDIÇÃO'
];

export const COLUMN_INDICES = {
  'Histórico': 0,
  'DATA ABERTURA': 1,
  'OP': 2,
  'DESCRIÇÃO': 3,
  'RETORNO': 4,
  'TME': 5,
  'H_FINALIZADA': 6,
  'OPERADOR': 7,
  'SERVIÇO': 8,
  'CUMPRIDA': 9,
  'VT': 10,
  'PROC': 11,
  'CARTEIRA': 12,
  'TEC': 13,
  'CAMINHO': 14,
  'BAIRRO': 15,
  'H_RETORNO': 16,
  'CIDADE': 17,
  'RUA': 18,
  'ASSUNTO': 19,
  'RESOLUÇÃO BO:': 20,
  'UF': 21,
  'REGIONAL': 22,
  'CONTRATO :': 23,
  'CLIENTE': 24,
  'STATUS': 25,
  'ÚLTIMA EDIÇÃO': 27
};

export const DEFAULT_VISIBLE_COLUMNS = {
  OPERADOR: true,
  'SERVIÇO': true,
  'Histórico': true,
  STATUS: true,
  RETORNO: true,
  ASSUNTO: true,
  CARTEIRA: true,
  CIDADE: true,
  TEC: true,
  'DESCRIÇÃO': true,
  'DATA ABERTURA': true,
  H_RETORNO: false,
  'RESOLUÇÃO BO:': false,
  CLIENTE: false,
  UF: false,
  REGIONAL: false,
  'ÚLTIMA EDIÇÃO': true
};

export const DATA_START_ROW = 8;

export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://opb2b-backend-production.up.railway.app' 
  : 'http://localhost:3001';

export const FIELD_MAPPING = {
  'operador': 'OPERADOR',
  'servico': 'SERVIÇO',
  'status': 'STATUS',
  'carteira': 'CARTEIRA',
  'cidade': 'CIDADE',
  'tecnico': 'TEC',
  'cliente': 'CLIENTE',
  'assuntos': 'ASSUNTO',
  'descricao': 'DESCRIÇÃO'
};

// INTERFACE FILTERSTATE AQUI MESMO
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

// Estado inicial dos filtros
export const INITIAL_FILTER_STATE: FilterState = {
  operador: [],
  servico: '',
  status: [],
  carteira: [],
  cidade: '',
  tecnico: '',
  dataInicio: '',
  dataFim: '',
  buscaGeral: '',
  prioridade: '',
  cliente: '',
  assuntos: '',
  descricao: '',
  uf: '',
  regional: '',
  temRetorno: '',
  periodoRetorno: '',
  statusAndamento: '',
  valorMinimo: '',
  valorMaximo: '',
  tipoServico: '',
  origem: '',
  urgencia: '',
  responsavel: '',
  tags: []
};

// Tipos TypeScript
export type StatusType = typeof STATUS_LIST[number];
export type CarteiraType = typeof CARTEIRAS_LIST[number];
export type OperadorType = typeof OPERADOR_LIST[number];
export type ColumnNameType = typeof TABLE_COLUMN_ORDER[number];
export type FieldMappingType = keyof typeof FIELD_MAPPING;