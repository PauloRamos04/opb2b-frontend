'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Edit,
  AlertCircle,
  Clock,
  PhoneCall
} from 'lucide-react';
import { TABLE_COLUMN_ORDER, COLUMN_INDICES } from '@/constants/spreadsheet';

interface FilteredDataItem {
  data: string[];
  originalIndex: number;
}

interface TableProps {
  filteredData: FilteredDataItem[];
  colunasVisiveis: Record<string, boolean>;
  editingCell: { row: number; col: number } | null;
  editValue: string;
  setEditValue: React.Dispatch<React.SetStateAction<string>>;
  handleCellEdit: (row: number, col: number, value: string) => void;
  handleSaveEdit: () => Promise<void>;
  handleCancelEdit: () => void;
  abrirPopup: (tipo: 'detalhes' | 'novo', dados: any, linha: number | null) => void;
  pegarChamado: (dadosRow: any, actualRowIndex: number) => Promise<void>;
  renderStatusBadge: (status: string) => JSX.Element;
  renderCarteiraBadge: (carteira: string) => JSX.Element;
}

const Table: React.FC<TableProps> = ({
  filteredData,
  colunasVisiveis,
  editingCell,
  editValue,
  setEditValue,
  handleCellEdit,
  handleSaveEdit,
  handleCancelEdit,
  abrirPopup,
  pegarChamado,
  renderStatusBadge,
  renderCarteiraBadge
}) => {
  const { darkMode } = useTheme();

  const getCellValue = (row: string[], colName: string): string => {
    const colIndex = COLUMN_INDICES[colName as keyof typeof COLUMN_INDICES];
    return row[colIndex] || '';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b ${darkMode ? 'text-gray-50 border-gray-600' : 'text-gray-500 border-gray-200'
                }`}>
                Ações
              </th>
              {TABLE_COLUMN_ORDER
                .filter(colName => colunasVisiveis[colName as keyof typeof colunasVisiveis])
                .map((colName) => (
                  <th key={colName} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider border-b ${darkMode ? 'text-gray-50 border-gray-600' : 'text-gray-500 border-gray-200'
                    }`}>
                    {colName}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'bg-gray-800 divide-gray-600' : 'bg-white divide-gray-200'}`}>
            {filteredData.map((item, rowIndex) => {
              const row = item.data;
              const actualRowIndex = item.originalIndex;

              const dadosRow = {
                id: actualRowIndex,
                operador: getCellValue(row, 'OPERADOR'),
                historico: getCellValue(row, 'Histórico'),
                servico: getCellValue(row, 'SERVIÇO'),
                status: getCellValue(row, 'STATUS'),
                retorno: getCellValue(row, 'RETORNO'),
                assuntos: getCellValue(row, 'ASSUNTO'),
                carteira: getCellValue(row, 'CARTEIRA'),
                cidade: getCellValue(row, 'CIDADE'),
                tecnico: getCellValue(row, 'TEC'),
                descricao: getCellValue(row, 'DESCRIÇÃO'),
                dataAbertura: getCellValue(row, 'DATA ABERTURA'),
                cliente: getCellValue(row, 'CLIENTE'),
                ultimaEdicao: getCellValue(row, 'ÚLTIMA EDIÇÃO')
              };

              const temRetorno = dadosRow.retorno && dadosRow.retorno.trim() !== '';

              return (
                <tr key={actualRowIndex} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                  <td className="px-4 py-4 whitespace-nowrap border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => abrirPopup('detalhes', dadosRow, actualRowIndex)}
                        className="flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 text-sm transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => {
                          if (!temRetorno) {
                            pegarChamado(dadosRow, actualRowIndex);
                          }
                        }}
                        disabled={!!temRetorno}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${temRetorno
                            ? darkMode
                              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        title={
                          temRetorno
                            ? "Chamado já atribuído"
                            : "Pegar chamado (definir horário de retorno)"
                        }
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Pegar</span>
                      </button>
                    </div>
                  </td>
                  {TABLE_COLUMN_ORDER
                    .filter(colName => colunasVisiveis[colName as keyof typeof colunasVisiveis])
                    .map((colName) => {
                      const value = getCellValue(row, colName);

                      return (
                        <td key={colName} className={`px-4 py-4 whitespace-nowrap text-sm border-b ${darkMode ? 'text-white border-gray-700' : 'text-gray-600 border-gray-300'
                          }`}>
                          <div className="max-w-xs">
                            {colName === 'STATUS' ? (
                              <div className="inline-block">
                                {renderStatusBadge(value)}
                              </div>
                            ) : colName === 'CARTEIRA' ? (
                              <div className="inline-block">
                                {renderCarteiraBadge(value)}
                              </div>
                            ) : colName === 'RETORNO' && value ? (
                              <span className="text-green-600 font-medium flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {value}
                              </span>
                            ) : colName === 'OPERADOR' && value.toUpperCase() === 'LIVRE' ? (
                              <span className="text-green-600 font-medium flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                {value}
                              </span>
                            ) : (
                              <span
                                title={value}
                                className={`${darkMode ? 'text-gray-200' : 'text-gray-900'} truncate block`}
                              >
                                {value}
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

      {filteredData.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nenhum registro encontrado</h3>
          <p className="text-sm">Ajuste os filtros ou adicione novos chamados</p>
        </div>
      )}
    </div>
  );
};

export default Table;