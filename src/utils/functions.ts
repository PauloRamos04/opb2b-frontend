import { FilterState, FilteredDataItem, ValoresUnicos } from '../types';
import { COLUMN_INDICES, DATA_START_ROW } from '../constants';

export const getUniqueValues = (values: string[]): string[] => {
  return [...new Set(values.filter(Boolean))].sort();
};

export const extractValoresUnicos = (data: string[][]): ValoresUnicos => {
  if (data.length === 0) return {
    operadores: [], servico: [], status: [], carteiras: [], cidades: [],
    assuntos: [], tecnicos: [], clientes: [], ufs: [], regionais: [], responsaveis: []
  };

  const dataRows = data.slice(DATA_START_ROW);
  
  return {
    operadores: getUniqueValues(dataRows.map(row => row[COLUMN_INDICES.OPERADOR] || '')),
    servico: getUniqueValues(dataRows.map(row => row[COLUMN_INDICES.SERVIÇO] || '')),
    status: getUniqueValues(dataRows.map(row => row[COLUMN_INDICES.STATUS] || '')),
    carteiras: getUniqueValues(dataRows.map(row => row[COLUMN_INDICES.CARTEIRA] || '')),
    cidades: getUniqueValues(dataRows.map(row => row[COLUMN_INDICES.CIDADE] || '')),
    assuntos: getUniqueValues(dataRows.map(row => row[COLUMN_INDICES.ASSUNTO] || '')),
    tecnicos: getUniqueValues(dataRows.map(row => row[COLUMN_INDICES.TEC] || '')),
    clientes: getUniqueValues(dataRows.map(row => row[COLUMN_INDICES.CLIENTE] || '')),
    ufs: getUniqueValues(dataRows.map(row => row[COLUMN_INDICES.UF] || '')),
    regionais: getUniqueValues(dataRows.map(row => row[COLUMN_INDICES.REGIONAL] || '')),
    responsaveis: getUniqueValues(dataRows.map(row => row[COLUMN_INDICES.OPERADOR] || ''))
  };
};

const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date(0);
  
  const formats = [
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{4})-(\d{1,2})-(\d{1,2})/
  ];
  
  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      if (format === formats[0]) {
        return new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
      } else {
        return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      }
    }
  }
  
  return new Date(dateStr);
};

export const filterData = (
  data: string[][],
  filters: FilterState,
  columnIndices: Record<string, number>
): string[][] => {
  console.log('🔍 Aplicando filtros:', filters);
  console.log('📊 Dados recebidos:', data.length, 'linhas');
  
  if (data.length === 0) {
    console.log('❌ Nenhum dado para filtrar');
    return [];
  }
  
  const filteredData = data.filter(row => {
    // Se não há filtros ativos, mostrar todos os dados
    const hasActiveFilters = 
      (filters.operador && filters.operador.length > 0) ||
      (filters.servico && filters.servico.trim() !== '') ||
      (filters.status && filters.status.length > 0) ||
      (filters.carteira && filters.carteira.length > 0) ||
      (filters.cidade && filters.cidade.trim() !== '') ||
      (filters.tecnico && filters.tecnico.trim() !== '') ||
      (filters.cliente && filters.cliente.trim() !== '') ||
      (filters.assuntos && filters.assuntos.trim() !== '') ||
      (filters.descricao && filters.descricao.trim() !== '') ||
      (filters.uf && filters.uf.trim() !== '') ||
      (filters.regional && filters.regional.trim() !== '') ||
      (filters.buscaGeral && filters.buscaGeral.trim() !== '') ||
      (filters.dataInicio && filters.dataInicio.trim() !== '') ||
      (filters.dataFim && filters.dataFim.trim() !== '');

    if (!hasActiveFilters) {
      return true; // Mostrar todos os dados se não há filtros
    }

    // Aplicar filtros apenas se estiverem ativos
    if (filters.operador && filters.operador.length > 0) {
      const operador = row[columnIndices.OPERADOR] || '';
      if (!filters.operador.includes(operador)) return false;
    }

    if (filters.servico && filters.servico.trim() !== '') {
      const servico = row[columnIndices.SERVIÇO] || '';
      if (!servico.toLowerCase().includes(filters.servico.toLowerCase())) return false;
    }

    if (filters.status && filters.status.length > 0) {
      const status = row[columnIndices.STATUS] || '';
      if (!filters.status.includes(status)) return false;
    }

    if (filters.carteira && filters.carteira.length > 0) {
      const carteira = row[columnIndices.CARTEIRA] || '';
      if (!filters.carteira.includes(carteira)) return false;
    }

    if (filters.cidade && filters.cidade.trim() !== '') {
      const cidade = row[columnIndices.CIDADE] || '';
      if (!cidade.toLowerCase().includes(filters.cidade.toLowerCase())) return false;
    }

    if (filters.tecnico && filters.tecnico.trim() !== '') {
      const tecnico = row[columnIndices.TEC] || '';
      if (!tecnico.toLowerCase().includes(filters.tecnico.toLowerCase())) return false;
    }

    if (filters.cliente && filters.cliente.trim() !== '') {
      const cliente = row[columnIndices.CLIENTE] || '';
      if (!cliente.toLowerCase().includes(filters.cliente.toLowerCase())) return false;
    }

    if (filters.assuntos && filters.assuntos.trim() !== '') {
      const assuntos = row[columnIndices.ASSUNTO] || '';
      if (!assuntos.toLowerCase().includes(filters.assuntos.toLowerCase())) return false;
    }

    if (filters.descricao && filters.descricao.trim() !== '') {
      const descricao = row[columnIndices.DESCRIÇÃO] || '';
      if (!descricao.toLowerCase().includes(filters.descricao.toLowerCase())) return false;
    }

    if (filters.uf && filters.uf.trim() !== '') {
      const uf = row[columnIndices.UF] || '';
      if (!uf.toLowerCase().includes(filters.uf.toLowerCase())) return false;
    }

    if (filters.regional && filters.regional.trim() !== '') {
      const regional = row[columnIndices.REGIONAL] || '';
      if (!regional.toLowerCase().includes(filters.regional.toLowerCase())) return false;
    }
    
    if (filters.buscaGeral && filters.buscaGeral.trim() !== '') {
      const termo = filters.buscaGeral.toLowerCase();
      const encontrado = row.some(cell => cell?.toLowerCase().includes(termo));
      if (!encontrado) return false;
    }
    
    if (filters.dataInicio || filters.dataFim) {
      const dataAbertura = row[columnIndices['DATA ABERTURA']] || '';
      const dataRow = parseDate(dataAbertura);
      
      if (filters.dataInicio) {
        const dataInicio = new Date(filters.dataInicio);
        if (dataRow < dataInicio) return false;
      }
      
      if (filters.dataFim) {
        const dataFim = new Date(filters.dataFim);
        dataFim.setHours(23, 59, 59, 999);
        if (dataRow > dataFim) return false;
      }
    }
    
    return true;
  });

  console.log('✅ Dados filtrados:', filteredData.length, 'linhas');
  return filteredData;
};