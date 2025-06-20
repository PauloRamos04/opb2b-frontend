import { useState, useMemo } from 'react';
import { FilterState, FilteredDataItem } from '../types';
import { INITIAL_FILTER_STATE } from '../config';
import { filterData, extractValoresUnicos } from '../utils/functions';
import { COLUMN_INDICES } from '@/constants';

export const useFilters = (data: string[][]) => {
  const [filtros, setFiltros] = useState<FilterState>(INITIAL_FILTER_STATE);
  
  const valoresUnicos = useMemo(() => extractValoresUnicos(data), [data]);
  
  const filteredData = useMemo(() => filterData(data, filtros, COLUMN_INDICES), [data, filtros, COLUMN_INDICES]);
  
  const limparFiltros = () => setFiltros(INITIAL_FILTER_STATE);
  
  return {
    filtros,
    setFiltros,
    valoresUnicos,
    filteredData,
    limparFiltros
  };
};