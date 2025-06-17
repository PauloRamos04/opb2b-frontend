import React from 'react';
import { Edit, Eye, CheckCircle, X } from 'lucide-react';
import StatusBadge from './StatusBadge';
import CarteiraBadge from './CarteiraBadge';
import { truncateText } from '@/utils/functions';

interface SpreadsheetTableProps {
  filteredData: string[][];
  tableColumnOrder: string[];
  colunasVisiveis: any;
  editingCell: { row: number; col: number } | null;
  editValue: string;
  setEditValue: (value: string) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  getCellValue: (row: string[], colName: string) => string;
  abrirPopup: (tipo: 'detalhes' | 'novo', dados?: any, linha?: number | null) => void;
  handleCellEdit: (row: number, col: number, value: string) => void;
  columnIndices: any;
  darkMode: boolean;
}

const SpreadsheetTable: React.FC<SpreadsheetTableProps> = ({
  filteredData,
  tableColumnOrder,
  colunasVisiveis,
  editingCell,
  editValue,
  setEditValue,
  handleSaveEdit,
  handleCancelEdit,
  getCellValue,
  abrirPopup,
  handleCellEdit,
  columnIndices,
  darkMode
}) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Ações
              </th>
              {tableColumnOrder
                .filter(colName => colunasVisiveis[colName as keyof typeof colunasVisiveis])
                .map((colName) => (
                <th key={colName} className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {colName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-600' : 'divide-gray-200'}`}>
            {filteredData.map((row, rowIndex) => {
              const actualRowIndex = rowIndex + 8;
              const dadosRow = {
                id: actualRowIndex,
                operador: getCellValue(row, 'OPERADOR'),
                historico: getCellValue(row, 'Histórico'),
                status: getCellValue(row, 'STATUS'),
                assunto: getCellValue(row, 'ASSUNTO'),
                carteira: getCellValue(row, 'CARTEIRA'),
                cidade: getCellValue(row, 'CIDADE'),
                tecnico: getCellValue(row, 'TEC'),
                descricao: getCellValue(row, 'DESCRIÇÃO'),
                dataAbertura: getCellValue(row, 'DATA ABERTURA'),
                cliente: getCellValue(row, 'CLIENTE'),
                uf: getCellValue(row, 'UF'),
                regional: getCellValue(row, 'REGIONAL'),
                ultimaEdicao: getCellValue(row, 'ÚLTIMA EDIÇÃO')
              };

              return (
                <tr key={actualRowIndex} className={`hover:bg-opacity-50 ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => abrirPopup('detalhes', dadosRow, actualRowIndex)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleCellEdit(actualRowIndex, 0, getCellValue(row, 'Histórico'))}
                        className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  
                  {tableColumnOrder
                    .filter(colName => colunasVisiveis[colName as keyof typeof colunasVisiveis])
                    .map((colName) => {
                      const cellValue = getCellValue(row, colName);
                      const colIndex = columnIndices[colName as keyof typeof columnIndices];
                      const isEditing = editingCell?.row === actualRowIndex && editingCell?.col === colIndex;

                      if (isEditing) {
                        return (
                          <td key={colName} className="px-3 py-2">
                            <div className="flex items-center space-x-1">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className={`w-full px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                                  darkMode 
                                    ? 'bg-gray-600 border-gray-500 text-white' 
                                    : 'bg-white border-gray-300 text-gray-900'
                                }`}
                                autoFocus
                              />
                              <button
                                onClick={handleSaveEdit}
                                className="p-1 text-green-600 hover:text-green-800"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td 
                          key={colName} 
                          className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                          onClick={() => handleCellEdit(actualRowIndex, colIndex, cellValue)}
                        >
                          <div className="max-w-xs">
                            {colName === 'STATUS' ? (
                              <StatusBadge status={cellValue} />
                            ) : colName === 'CARTEIRA' ? (
                              <CarteiraBadge carteira={cellValue} />
                            ) : (
                              <span 
                                className={`text-xs ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                                title={cellValue}
                              >
                                {truncateText(cellValue, 30)}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpreadsheetTable;