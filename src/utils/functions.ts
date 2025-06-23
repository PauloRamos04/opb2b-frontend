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

// Função para parsear datas nos formatos 'DD/MM/YYYY HH:mm:ss' ou 'DD/MM/YYYY'
export const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  // Tenta o formato 'DD/MM/YYYY HH:mm:ss'
  let parts = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?: (\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (parts) {
    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1; // Mês é 0-indexado
    const year = parseInt(parts[3], 10);
    const hour = parts[4] ? parseInt(parts[4], 10) : 0;
    const minute = parts[5] ? parseInt(parts[5], 10) : 0;
    const second = parts[6] ? parseInt(parts[6], 10) : 0;

    return new Date(year, month, day, hour, minute, second);
  }

  // Tenta o formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ) ou similar
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return null;
};

export const filterData = (
  data: string[][],
  filters: FilterState,
  columnIndices: Record<string, number>
): string[][] => {
  if (data.length === 0) {
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
      if (!dataRow) return false;
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

  return filteredData;
};

export const filterDataDetailed = (
  originalData: string[][],
  filteredData: FilteredDataItem[],
  columnIndices: Record<string, number>
): FilteredDataItem[] => {
  if (originalData.length === 0) {
    return [];
  }
  
  return filteredData.reduce((acc, item) => {
    const dataRow = originalData.find(row => row[columnIndices.Histórico] === item.data[columnIndices.Histórico]);
    
    if (dataRow) {
      acc.push({
        ...item,
        data: dataRow,
      });
    }

    return acc;
  }, [] as FilteredDataItem[]);
};