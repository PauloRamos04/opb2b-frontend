// src/types/filters.ts

export interface FilterState {
  operador: string;
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
  assunto: string;
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