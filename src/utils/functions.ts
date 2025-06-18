import { FilterState } from '@/types/filters';

export const getUniqueValues = (values: string[]): string[] => {
  const unique: string[] = [];
  
  values.forEach(value => {
    if (value && value.trim() !== '' && !unique.includes(value)) {
      unique.push(value);
    }
  });
  
  return unique.sort();
};

export const filterData = (
  data: string[][],
  filters: FilterState,
  columnIndices: Record<string, number>
): string[][] => {
  return data.filter(row => {
    // Busca geral
    if (filters.buscaGeral && filters.buscaGeral.trim() !== '') {
      const searchTerm = filters.buscaGeral.toLowerCase();
      const hasMatch = row.some(cell => 
        cell && cell.toString().toLowerCase().includes(searchTerm)
      );
      if (!hasMatch) return false;
    }

    /* Filtro por operador
    if (filters.operador && filters.operador.trim() !== '') {
      const operador = row[columnIndices.OPERADOR] || '';
      if (!operador.toLowerCase().includes(filters.operador.toLowerCase())) {
        return false;
      }
    } */

    // Filtro por múltiplos status
    if (filters.status && filters.status.length > 0) {
      const status = row[columnIndices.STATUS] || '';
      if (!filters.status.includes(status)) {
        return false;
      }
    }

    // Filtro por múltiplas carteiras
    if (filters.carteira && filters.carteira.length > 0) {
      const carteira = row[columnIndices.CARTEIRA] || '';
      if (!filters.carteira.includes(carteira)) {
        return false;
      }
    }

    //Filtro por multiplos operadores
    if (filters.operador && filters.operador.length > 0) {
      const operador = row[columnIndices.OPERADOR] || '';
      if (!filters.operador.includes(operador)) {
        return false;
      }
    }

    // Filtro por cidade
    if (filters.cidade && filters.cidade.trim() !== '') {
      const cidade = row[columnIndices.CIDADE] || '';
      if (!cidade.toLowerCase().includes(filters.cidade.toLowerCase())) {
        return false;
      }
    }

    // Filtro por técnico
    if (filters.tecnico && filters.tecnico.trim() !== '') {
      const tecnico = row[columnIndices.TEC] || '';
      if (!tecnico.toLowerCase().includes(filters.tecnico.toLowerCase())) {
        return false;
      }
    }

    // Filtro por cliente
    if (filters.cliente && filters.cliente.trim() !== '') {
      const cliente = row[columnIndices.CLIENTE] || '';
      if (!cliente.toLowerCase().includes(filters.cliente.toLowerCase())) {
        return false;
      }
    }

    // Filtro por assuntos
    if (filters.assuntos && filters.assuntos.trim() !== '') {
      const assuntos = row[columnIndices.ASSUNTO] || '';
      if (!assuntos.toLowerCase().includes(filters.assuntos.toLowerCase())) {
        return false;
      }
    }

    // Filtro por descrição
    if (filters.descricao && filters.descricao.trim() !== '') {
      const descricao = row[columnIndices.DESCRIÇÃO] || '';
      if (!descricao.toLowerCase().includes(filters.descricao.toLowerCase())) {
        return false;
      }
    }

    // Filtro por UF
    if (filters.uf && filters.uf.trim() !== '') {
      const uf = row[columnIndices.UF] || '';
      if (uf !== filters.uf) {
        return false;
      }
    }

    // Filtro por serviço
    if (filters.servico && filters.servico.trim() !== '') {
      const servico = row[columnIndices.SERVIÇO] || '';
      if (!servico.toLowerCase().includes(filters.servico.toLowerCase())) {
        return false;
      }
    }

    // Filtro por data
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

    // Filtro por período de retorno
    if (filters.periodoRetorno && filters.periodoRetorno !== '') {
      const retorno = row[columnIndices.RETORNO] || '';
      if (!matchesPeriodoRetorno(retorno, filters.periodoRetorno)) {
        return false;
      }
    }

    // Filtro por ter retorno
    if (filters.temRetorno && filters.temRetorno !== '') {
      const retorno = row[columnIndices.RETORNO] || '';
      const temRetorno = retorno.trim() !== '';
      
      if (filters.temRetorno === 'sim' && !temRetorno) return false;
      if (filters.temRetorno === 'nao' && temRetorno) return false;
    }

    return true;
  });
};

export const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date(0);
  
  try {
    // Tenta diferentes formatos de data
    const formats = [
      /(\d{2})\/(\d{2})\/(\d{4})/,  // DD/MM/YYYY
      /(\d{4})-(\d{2})-(\d{2})/,    // YYYY-MM-DD
      /(\d{2})-(\d{2})-(\d{4})/     // DD-MM-YYYY
    ];

    for (const format of formats) {
      const match = dateString.match(format);
      if (match) {
        const [, first, second, third] = match;
        
        // Para formato DD/MM/YYYY ou DD-MM-YYYY
        if (format.source.startsWith('(\\d{2})')) {
          return new Date(parseInt(third), parseInt(second) - 1, parseInt(first));
        }
        // Para formato YYYY-MM-DD
        else {
          return new Date(parseInt(first), parseInt(second) - 1, parseInt(third));
        }
      }
    }

    return new Date(dateString);
  } catch {
    return new Date(0);
  }
};

export const matchesPeriodoRetorno = (retorno: string, periodo: string): boolean => {
  if (!retorno || !periodo) return true;

  const hoje = new Date();
  const dataRetorno = parseDate(retorno);

  switch (periodo) {
    case 'hoje':
      return isSameDay(dataRetorno, hoje);
    
    case 'amanha':
      const amanha = new Date(hoje);
      amanha.setDate(hoje.getDate() + 1);
      return isSameDay(dataRetorno, amanha);
    
    case 'esta_semana':
      return isThisWeek(dataRetorno, hoje);
    
    case 'proxima_semana':
      return isNextWeek(dataRetorno, hoje);
    
    case 'este_mes':
      return dataRetorno.getMonth() === hoje.getMonth() && 
             dataRetorno.getFullYear() === hoje.getFullYear();
    
    case 'proximo_mes':
      const proximoMes = new Date(hoje);
      proximoMes.setMonth(hoje.getMonth() + 1);
      return dataRetorno.getMonth() === proximoMes.getMonth() && 
             dataRetorno.getFullYear() === proximoMes.getFullYear();
    
    case 'vencido':
      return dataRetorno < hoje;
    
    default:
      return true;
  }
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

export const isThisWeek = (date: Date, reference: Date): boolean => {
  const startOfWeek = new Date(reference);
  startOfWeek.setDate(reference.getDate() - reference.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return date >= startOfWeek && date <= endOfWeek;
};

export const isNextWeek = (date: Date, reference: Date): boolean => {
  const nextWeekStart = new Date(reference);
  nextWeekStart.setDate(reference.getDate() - reference.getDay() + 7);
  nextWeekStart.setHours(0, 0, 0, 0);
  
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
  nextWeekEnd.setHours(23, 59, 59, 999);
  
  return date >= nextWeekStart && date <= nextWeekEnd;
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};