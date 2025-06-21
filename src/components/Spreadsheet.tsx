'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSpreadsheet } from '@/contexts/SpreadsheetContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Table from '@/components/Table';
import Popup from '@/components/Popup';
import { RefreshCw, X } from 'lucide-react';
import { getUniqueValues, filterData } from '@/utils/functions';
import { renderStatusBadge, renderCarteiraBadge } from '@/utils/badges';
import {
  COLUMN_INDICES,
  DEFAULT_VISIBLE_COLUMNS,
  DATA_START_ROW,
  API_BASE_URL,
  FIELD_MAPPING
} from '@/constants';
import { FilterState } from '@/types';
import { INITIAL_FILTER_STATE } from '@/config';
import SpreadsheetLoading from './Spreadsheet/SpreadsheetLoading';
import SpreadsheetError from './Spreadsheet/SpreadsheetError';
import SpreadsheetToolbar from './Spreadsheet/SpreadsheetToolbar';
import SpreadsheetTable from './Spreadsheet/SpreadsheetTable';

interface PopupData {
  aberto: boolean;
  tipo: 'detalhes' | 'novo' | '';
  dados: any;
  linha: number | null;
}

interface FilteredDataItem {
  data: string[];
  originalIndex: number;
}

const Spreadsheet: React.FC = () => {
  const { data, loading, error, updateCell, refreshData, isConnected } = useSpreadsheet();
  const { darkMode } = useTheme();

  const [filteredData, setFilteredData] = useState<FilteredDataItem[]>([]);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [popup, setPopup] = useState<PopupData>({ aberto: false, tipo: '', dados: null, linha: null });
  const [novoAndamento, setNovoAndamento] = useState('');
  const [formValues, setFormValues] = useState<any>({});

  const [filtrosAvancados, setFiltrosAvancados] = useState<FilterState>({
    ...INITIAL_FILTER_STATE,
    status: [],
    carteira: [],
    operador: [],
    tags: []
  });

  const [colunasVisiveis, setColunasVisiveis] = useState<Record<string, boolean>>({
    ...DEFAULT_VISIBLE_COLUMNS
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const valoresUnicos = useMemo(() => {
    if (data.length === 0) return {
      operadores: [],
      servico: [],
      status: [],
      carteiras: [],
      cidades: [],
      assuntos: [],
      tecnicos: [],
      clientes: [],
      ufs: [],
      regionais: [],
      responsaveis: []
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
  }, [data]);

  useEffect(() => {
    if (data.length > 0) {
      applyFilters();
    }
  }, [data, filtrosAvancados]);

  const applyFilters = () => {
    const dataRows = data.slice(DATA_START_ROW);
    const filtered = filterData(dataRows, filtrosAvancados, COLUMN_INDICES);

    const filteredWithOriginalIndex = filtered.map((rowData) => {
      const originalIndex = dataRows.findIndex(dataRow => dataRow === rowData);
      return {
        data: rowData,
        originalIndex: originalIndex + DATA_START_ROW + 1
      };
    });

    setFilteredData(filteredWithOriginalIndex);
  };

  const handleCellEdit = (row: number, col: number, value: string) => {
    setEditingCell({ row, col });
    setEditValue(value);
  };

  const handleSaveEdit = async () => {
    if (editingCell) {
      try {
        await updateCell(editingCell.row, editingCell.col, editValue);
        setEditingCell(null);
        setEditValue('');
        await refreshData();
      } catch (error) {
        console.error('Erro ao salvar:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        alert(`Erro ao salvar: ${errorMessage}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const abrirPopup = (tipo: 'detalhes' | 'novo', dados: any = null, linha: number | null = null) => {
    setPopup({ aberto: true, tipo, dados, linha });
    setNovoAndamento('');
    if (dados) {
      setFormValues(dados);
    }
  };

  const fecharPopup = () => {
    setPopup({ aberto: false, tipo: '', dados: null, linha: null });
    setNovoAndamento('');
    setFormValues({});
  };

  const pegarChamado = async (dadosRow: any, actualRowIndex: number) => {
    try {
      const agora = new Date();
      const dia = agora.getDate().toString().padStart(2, '0');
      const mes = (agora.getMonth() + 1).toString().padStart(2, '0');
      const hora = agora.getHours().toString().padStart(2, '0');
      const minutos = agora.getMinutes().toString().padStart(2, '0');
      const dataFormatada = `${dia}/${mes} ${hora}:${minutos}`;
      const retornoColIndex = COLUMN_INDICES['RETORNO'];
      const operadorColIndex = COLUMN_INDICES['OPERADOR'];
  
      const operador = JSON.parse(localStorage.getItem('auth_user') || '{}')?.operador || 'DESCONHECIDO';
  
      // Atualiza a coluna de RETORNO (data/hora)
      const updateRetorno = fetch(`${API_BASE_URL}/spreadsheet/update-cell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          row: actualRowIndex,
          col: retornoColIndex,
          value: dataFormatada
        })
      });
  
      // Atualiza a coluna de OPERADOR
      const updateOperador = fetch(`${API_BASE_URL}/spreadsheet/update-cell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          row: actualRowIndex,
          col: operadorColIndex,
          value: operador
        })
      });
  
      // Aguarda ambas atualizações
      const [resRetorno, resOperador] = await Promise.all([updateRetorno, updateOperador]);
  
      const resultRetorno = await resRetorno.json();
      const resultOperador = await resOperador.json();
  
      if (!resultRetorno.success || !resultOperador.success) {
        throw new Error('Erro ao atualizar células de retorno ou operador');
      }
  
      alert(`✅ Chamado #${dadosRow.historico} pego com sucesso!`);
      await refreshData();
    } catch (error) {
      console.error('❌ Erro ao pegar chamado:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`❌ Erro ao pegar chamado: ${errorMessage}`);
    }
  };
  

  const adicionarAndamento = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!novoAndamento.trim()) {
      alert('Por favor, digite um andamento antes de salvar.');
      return;
    }

    try {
      const timestamp = new Date().toLocaleString('pt-BR');
      const novoAndamentoCompleto = `${timestamp} - ${novoAndamento}`;
      const rowIndex = popup.linha;
      const colIndex = COLUMN_INDICES['DESCRIÇÃO'];

      if (rowIndex !== null) {
        const valorAtual = popup.dados?.descricao || '';
        const novoValor = valorAtual
          ? `${valorAtual}\n${novoAndamentoCompleto}`
          : novoAndamentoCompleto;

        const response = await fetch(`${API_BASE_URL}/spreadsheet/update-cell`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            row: rowIndex,
            col: colIndex,
            value: novoValor
          })
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Erro ao atualizar célula');
        }

        setPopup(prev => ({
          ...prev,
          dados: { ...prev.dados, descricao: novoValor }
        }));

        setFormValues((prev: any) => ({
          ...prev,
          descricao: novoValor
        }));

        setNovoAndamento('');
        alert('✅ Andamento adicionado com sucesso!');
      } else {
        throw new Error('Linha não encontrada');
      }
    } catch (error) {
      console.error('❌ Erro ao adicionar andamento:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`❌ Erro ao salvar: ${errorMessage}`);
    }
  };

  const salvarAlteracoesPopup = async () => {
    try {
      if (!popup.dados || popup.linha === null) {
        throw new Error('Dados do popup não encontrados');
      }

      const form = document.querySelector('[data-popup-form]') as HTMLFormElement;
      if (!form) {
        throw new Error('Formulário não encontrado');
      }

      const formData = new FormData(form);
      const updates: Array<{ row: number, col: number, value: string }> = [];

      Object.entries(FIELD_MAPPING).forEach(([fieldName, columnName]) => {
        let value = formData.get(fieldName) as string;

        if (fieldName === 'descricao') {
          value = formValues.descricao || popup.dados.descricao || '';
        }

        if (value !== null) {
          const colIndex = COLUMN_INDICES[columnName as keyof typeof COLUMN_INDICES];
          updates.push({
            row: popup.linha!,
            col: colIndex,
            value: value
          });
        }
      });

      for (const update of updates) {
        const response = await fetch(`${API_BASE_URL}/spreadsheet/update-cell`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Erro ao atualizar célula');
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      }

      alert('✅ Todas as alterações foram salvas com sucesso!');
      fecharPopup();
      await refreshData();
    } catch (error) {
      console.error('❌ Erro ao salvar alterações:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      alert(`❌ Erro ao salvar: ${errorMessage}`);
    }
  };

  if (loading) {
    return <SpreadsheetLoading darkMode={darkMode} />;
  }

  if (error) {
    return <SpreadsheetError error={error} darkMode={darkMode} refreshData={refreshData} />;
  }

  return (
    <div className="w-full space-y-6">
      <SpreadsheetToolbar
        isConnected={isConnected}
        filtrosAvancados={filtrosAvancados}
        setFiltrosAvancados={setFiltrosAvancados}
        colunasVisiveis={colunasVisiveis}
        setColunasVisiveis={setColunasVisiveis}
        mostrarFiltros={mostrarFiltros}
        setMostrarFiltros={setMostrarFiltros}
        valoresUnicos={valoresUnicos}
        filteredDataLength={filteredData.length}
        refreshData={refreshData}
      />

      <SpreadsheetTable
        filteredData={filteredData}
        colunasVisiveis={colunasVisiveis}
        editingCell={editingCell}
        editValue={editValue}
        setEditValue={setEditValue}
        handleCellEdit={handleCellEdit}
        handleSaveEdit={handleSaveEdit}
        handleCancelEdit={handleCancelEdit}
        abrirPopup={abrirPopup}
        pegarChamado={pegarChamado}
        renderStatusBadge={(status) => renderStatusBadge(status, darkMode)}
        renderCarteiraBadge={(carteira) => renderCarteiraBadge(carteira, darkMode)}
      />

      <Popup
        popup={popup}
        novoAndamento={novoAndamento}
        setNovoAndamento={setNovoAndamento}
        formValues={formValues}
        setFormValues={setFormValues}
        fecharPopup={fecharPopup}
        adicionarAndamento={adicionarAndamento}
        salvarAlteracoesPopup={salvarAlteracoesPopup}
        pegarChamado={pegarChamado}
        renderStatusBadge={(status) => renderStatusBadge(status, darkMode)}
        renderCarteiraBadge={(carteira) => renderCarteiraBadge(carteira, darkMode)}
      />
    </div>
  );
};

export default Spreadsheet;