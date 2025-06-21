import React from 'react';
import Header from '@/components/Header';
import { FilterState } from '@/types';
import { RefreshCw } from 'lucide-react';

interface SpreadsheetToolbarProps {
  isConnected: boolean;
  filtrosAvancados: FilterState;
  setFiltrosAvancados: React.Dispatch<React.SetStateAction<FilterState>>;
  colunasVisiveis: Record<string, boolean>;
  setColunasVisiveis: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  mostrarFiltros: boolean;
  setMostrarFiltros: React.Dispatch<React.SetStateAction<boolean>>;
  valoresUnicos: any;
  filteredDataLength: number;
  refreshData: () => Promise<void>;
}

const SpreadsheetToolbar: React.FC<SpreadsheetToolbarProps> = (props) => {
  return (
    <Header
      isConnected={props.isConnected}
      filtrosAvancados={props.filtrosAvancados}
      setFiltrosAvancados={props.setFiltrosAvancados}
      colunasVisiveis={props.colunasVisiveis}
      setColunasVisiveis={props.setColunasVisiveis}
      mostrarFiltros={props.mostrarFiltros}
      setMostrarFiltros={props.setMostrarFiltros}
      valoresUnicos={props.valoresUnicos}
      filteredDataLength={props.filteredDataLength}
      refreshData={props.refreshData}
    />
  );
};

export default SpreadsheetToolbar; 