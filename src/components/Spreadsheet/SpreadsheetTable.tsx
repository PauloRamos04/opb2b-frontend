import React from 'react';
import Table from '@/components/Table';

interface SpreadsheetTableProps {
  filteredData: any[];
  colunasVisiveis: Record<string, boolean>;
  editingCell: { row: number; col: number } | null;
  editValue: string;
  setEditValue: React.Dispatch<React.SetStateAction<string>>;
  handleCellEdit: (row: number, col: number, value: string) => void;
  handleSaveEdit: () => Promise<void>;
  handleCancelEdit: () => void;
  abrirPopup: (tipo: 'detalhes' | 'novo', dados?: any, linha?: number | null) => void;
  pegarChamado: (dadosRow: any, actualRowIndex: number) => Promise<void>;
  renderStatusBadge: (status: string) => JSX.Element;
  renderCarteiraBadge: (carteira: string) => JSX.Element;
}

const SpreadsheetTable: React.FC<SpreadsheetTableProps> = (props) => {
  return (
    <Table
      filteredData={props.filteredData}
      colunasVisiveis={props.colunasVisiveis}
      editingCell={props.editingCell}
      editValue={props.editValue}
      setEditValue={props.setEditValue}
      handleCellEdit={props.handleCellEdit}
      handleSaveEdit={props.handleSaveEdit}
      handleCancelEdit={props.handleCancelEdit}
      abrirPopup={props.abrirPopup}
      pegarChamado={props.pegarChamado}
      renderStatusBadge={props.renderStatusBadge}
      renderCarteiraBadge={props.renderCarteiraBadge}
    />
  );
};

export default SpreadsheetTable; 