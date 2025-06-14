// Função para obter valores únicos de um array sem usar Set
export const getUniqueValues = (values: string[]): string[] => {
    const unique: string[] = [];
    
    values.forEach(value => {
      if (value && value.trim() !== '' && !unique.includes(value)) {
        unique.push(value);
      }
    });
    
    return unique.sort();
  };
  
  // Função para filtrar dados
  export const filterData = (
    data: string[][],
    filters: any,
    columnIndices: Record<string, number>
  ): string[][] => {
    return data.filter(row => {
      // Filtro por operador
      if (filters.operador && filters.operador.trim() !== '') {
        const operador = row[columnIndices.OPERADOR] || '';
        if (!operador.toLowerCase().includes(filters.operador.toLowerCase())) {
          return false;
        }
      }
  
      // Filtro por status
      if (filters.status && filters.status !== '') {
        const status = row[columnIndices.STATUS] || '';
        if (status !== filters.status) {
          return false;
        }
      }
  
      // Filtro por carteira
      if (filters.carteira && filters.carteira !== '') {
        const carteira = row[columnIndices.CARTEIRA] || '';
        if (carteira !== filters.carteira) {
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
  
      // Filtro de busca geral
      if (filters.buscaGeral && filters.buscaGeral.trim() !== '') {
        const searchTerm = filters.buscaGeral.toLowerCase();
        const hasMatch = row.some(cell => 
          cell && cell.toString().toLowerCase().includes(searchTerm)
        );
        if (!hasMatch) {
          return false;
        }
      }
  
      // Filtro por data
      if (filters.dataInicio || filters.dataFim) {
        const dataAbertura = row[columnIndices['DATA ABERTURA']] || '';
        if (!dataAbertura) return false;
        
        try {
          const dataRow = new Date(dataAbertura.split('/').reverse().join('-'));
          
          if (filters.dataInicio) {
            const dataInicio = new Date(filters.dataInicio);
            if (dataRow < dataInicio) return false;
          }
          
          if (filters.dataFim) {
            const dataFim = new Date(filters.dataFim);
            if (dataRow > dataFim) return false;
          }
        } catch {
          return false;
        }
      }
  
      return true;
    });
  };
  
  // Função para formatar data
  export const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };
  
  // Função para truncar texto
  export const truncateText = (text: string, maxLength: number = 50): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  // Função para validar campos obrigatórios
  export const validateRequiredFields = (data: Record<string, any>, requiredFields: string[]): string[] => {
    const errors: string[] = [];
    
    requiredFields.forEach(field => {
      if (!data[field] || data[field].toString().trim() === '') {
        errors.push(`Campo ${field} é obrigatório`);
      }
    });
    
    return errors;
  };
  
  // Função para gerar ID único
  export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };
  
  // Função para converter coluna em letra (para Excel)
  export const columnToLetter = (col: number): string => {
    let result = '';
    while (col >= 0) {
      result = String.fromCharCode(65 + (col % 26)) + result;
      col = Math.floor(col / 26) - 1;
    }
    return result;
  };
  
  // Função para debounce (para filtros em tempo real)
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