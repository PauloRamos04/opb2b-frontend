import { useState } from 'react';
import { DEFAULT_VISIBLE_COLUMNS } from '../constants';

export const useColumns = () => {
  const [colunasVisiveis, setColunasVisiveis] = useState<Record<string, boolean>>(DEFAULT_VISIBLE_COLUMNS);
  
  const toggleColumn = (column: string) => {
    setColunasVisiveis(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };
  
  const resetColumns = () => setColunasVisiveis(DEFAULT_VISIBLE_COLUMNS);
  
  return {
    colunasVisiveis,
    setColunasVisiveis,
    toggleColumn,
    resetColumns
  };
};