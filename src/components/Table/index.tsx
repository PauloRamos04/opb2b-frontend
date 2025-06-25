'use client';

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Edit,
  AlertCircle,
  Clock,
  PhoneCall
} from 'lucide-react';
import { TABLE_COLUMN_ORDER, COLUMN_INDICES } from '@/constants';
import { renderOperadorBadge } from '@/utils/badges';
import TimeAgo from '../common/TimeAgo';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api.service';
import { toast } from 'react-hot-toast';

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

const RESOLUCOES_BO = [
  'B2B - OCORRENCIA DUPLICADA',
  'B2B - ABERTO VISITA TÉCNICA',
  'B2B - ABERTO ACOMPANHAMENTO DE V.T',
  'B2B - ABERTO ACOMPANHAMENTO DE VISTORIA',
  'B2B - ANULADA SEM CONTATO',
  'B2B - ÁREA SINALIZADA / ALERTA / RUIE',
  'B2B - NORMALIZADO SEM INTERVENÇÃO',
  'B2B - AJUSTES INTERNOS',
  'B2B - AGUARDANDO NOC',
  'B2B - AGUARDANDO ENGENHARIA',
  'B2B - AGUARDANDO TI',
  'B2B - AGUARDANDO TELEFONIA',
  'B2B - AGUARDANDO REDE EXTERNA',
  'B2B - SUPORTE AO CLIENTE',
  'B2B - FEITO PROCEDIMENTOS COM O CLIENTE - INTERNET / WI-FI',
  'B2B - PROBLEMA/LIMITAÇÃO NO EQUIPAMENTO DO ASSINANTE',
  'B2B - ABERTO VT - R.E',
  'B2B - FEITO PROCEDIMENTOS COM O CLIENTE - TELEFONE',
  'B2B - FIXADO IP',
  'B2B - SOLUCIONADO NOC',
  'B2B - VELOCIDADE REDUZIDA (1M)',
  'B2B - VALIDAÇÃO',
  'B2B - PERMUTA',
  'B2B - SOLUCIONADO ENGENHARIA',
  'S.I - SUPORTE',
  'S.I - ABERTO VT',
  'S.I - AJUSTES INTERNOS',
  'S.I - ANULADO SEM CONTATO',
  'S.I - OCORRÊNCIA DUPLICADA'
];

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
  const { user } = useAuth();
  const [finalizarModal, setFinalizarModal] = useState<{row: number, open: boolean}>({row: -1, open: false});
  const [resolucaoSelecionada, setResolucaoSelecionada] = useState('');
  const [finalizando, setFinalizando] = useState(false);
  const [finalizarError, setFinalizarError] = useState('');

  const getCellValue = (row: string[], colName: string): string => {
    const colIndex = COLUMN_INDICES[colName as keyof typeof COLUMN_INDICES];
    return row[colIndex] || '';
  };

  async function handleFinalizar(rowIndex: number) {
    setFinalizarModal({row: rowIndex, open: true});
    setResolucaoSelecionada('');
    setFinalizarError('');
  }

  async function confirmarFinalizacao(rowIndex: number) {
    setFinalizando(true);
    setFinalizarError('');
    try {
      if (!user) throw new Error('Usuário não autenticado');
      const agora = new Date();
      const dia = agora.getDate().toString().padStart(2, '0');
      const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
      const hora = agora.getHours().toString().padStart(2, '0');
      const minutos = agora.getMinutes().toString().padStart(2, '0');
      const horaFinalizada = `${dia}/${mes} ${hora}:${minutos}`;
      // Atualiza H_FINALIZADA
      const updateFinalizada = { row: rowIndex, col: COLUMN_INDICES['H_FINALIZADA'], value: horaFinalizada };
      // Atualiza RESOLUÇÃO BO:
      const updateResolucao = { row: rowIndex, col: COLUMN_INDICES['RESOLUÇÃO BO:'], value: resolucaoSelecionada };
      // Atualiza OPERADOR (igual ao pegarChamado)
      const updateOperador = { row: rowIndex, col: COLUMN_INDICES['OPERADOR'], value: user.operador };
      const [resFinalizada, resResolucao, resOperador] = await Promise.all([
        apiService.updateCell(updateFinalizada),
        apiService.updateCell(updateResolucao),
        apiService.updateCell(updateOperador)
      ]);
      if (!resFinalizada.success || !resResolucao.success || !resOperador.success) {
        throw new Error('Erro ao finalizar chamado');
      }
      toast.success('Chamado finalizado com sucesso!');
      setFinalizarModal({row: -1, open: false});
    } catch (err) {
      setFinalizarError('Erro ao finalizar chamado. Tente novamente.');
    } finally {
      setFinalizando(false);
    }
  }

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
                ultimaEdicao: getCellValue(row, 'ÚLTIMA EDIÇÃO'),
                hFinalizada: getCellValue(row, 'H_FINALIZADA')
              };

              const temRetorno = dadosRow.operador.trim() !== 'S/C' && dadosRow.retorno.trim() !== '';
              const jaFinalizado = !!(dadosRow.hFinalizada && dadosRow.hFinalizada.trim() !== '');

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
                      <button
                        onClick={() => handleFinalizar(actualRowIndex)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${jaFinalizado
                          ? darkMode
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200'
                        }`}
                        disabled={jaFinalizado}
                        title={jaFinalizado ? 'Chamado já finalizado' : 'Finalizar chamado'}
                      >
                        <span>Finalizar</span>
                      </button>
                    </div>
                  </td>
                  {TABLE_COLUMN_ORDER
                    .filter(colName => colunasVisiveis[colName as keyof typeof colunasVisiveis])
                    .map((colName) => {
                      const value = getCellValue(row, colName);

                      if (colName === 'OPERADOR') {
                        const dataAbertura = getCellValue(row, 'DATA ABERTURA');
                        const ultimaEdicao = getCellValue(row, 'ÚLTIMA EDIÇÃO');
                        const retorno = getCellValue(row, 'RETORNO');
                        return (
                          <td key={colName} className={`px-4 py-4 whitespace-nowrap text-sm border-b ${darkMode ? 'text-white border-gray-700' : 'text-gray-600 border-gray-300'}`}>
                            <div className="flex items-center gap-2">
                              <span>{value}</span>
                              {value === 'LIVRE' && dataAbertura && dataAbertura.trim() !== '' && (
                                <TimeAgo dateString={dataAbertura} />
                              )}
                              {value === 'S/C' && (
                                (ultimaEdicao && ultimaEdicao.trim() !== '' ?
                                  <TimeAgo dateString={ultimaEdicao} /> :
                                  (retorno && retorno.trim() !== '' && <TimeAgo dateString={retorno} />)
                                )
                              )}
                              {value !== 'LIVRE' && value !== 'S/C' && dataAbertura && dataAbertura.trim() !== '' && (
                                <TimeAgo dateString={dataAbertura} modoDias />
                              )}
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={colName} className={`px-4 py-4 whitespace-nowrap text-sm border-b ${darkMode ? 'text-white border-gray-700' : 'text-gray-600 border-gray-300'}`}>
                          <div className="max-w-xs">
                            {colName === 'STATUS' ? (
                              <div className="inline-block">
                                {renderStatusBadge(value)}
                              </div>
                            ) : colName === 'CARTEIRA' ? (
                              <div className="inline-block">
                                {renderCarteiraBadge(value)}
                              </div>
                            ) : colName === 'OPERADOR' ? (
                              <div className="inline-block">
                                {renderOperadorBadge(value, darkMode)}
                              </div>
                            ) : colName === 'RETORNO' && value ? (
                              <span className="text-green-600 font-medium flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
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

      {/* Modal de finalização */}
      {finalizarModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md`}>
            <h2 className="text-lg font-bold mb-4 text-fuchsia-700">Finalizar chamado</h2>
            <label className="block mb-2 font-medium">Selecione a RESOLUÇÃO BO:</label>
            <select
              value={resolucaoSelecionada}
              onChange={e => setResolucaoSelecionada(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="">Selecione...</option>
              {RESOLUCOES_BO.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {finalizarError && <div className="text-red-500 mb-2">{finalizarError}</div>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setFinalizarModal({row: -1, open: false})}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                disabled={finalizando}
              >Cancelar</button>
              <button
                onClick={() => confirmarFinalizacao(finalizarModal.row)}
                className="px-4 py-2 rounded bg-fuchsia-700 text-white hover:bg-fuchsia-800"
                disabled={!resolucaoSelecionada || finalizando}
              >Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;