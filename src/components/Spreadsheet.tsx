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
  INITIAL_FILTER_STATE,
  DATA_START_ROW,
  API_BASE_URL,
  FIELD_MAPPING,
  type FilterState
} from '@/constants/spreadsheet';

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

  // Usar o tipo correto para filtros
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
      const agora = new Date().toLocaleString('pt-BR');
      const colIndex = COLUMN_INDICES['RETORNO'];

      const response = await fetch(`${API_BASE_URL}/spreadsheet/update-cell`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          row: actualRowIndex,
          col: colIndex,
          value: agora
        })
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Erro ao atualizar célula');
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
    return (
      <div className={`flex items-center justify-center h-64 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2">Carregando dados...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'} border rounded-lg p-4`}>
        <div className="flex items-center">
          <X className="w-5 h-5 text-red-500 mr-2" />
          <span className={darkMode ? 'text-red-300' : 'text-red-700'}>Erro: {error}</span>
        </div>
        <button
          onClick={refreshData}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Header
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

      <Table
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
        renderStatusBadge={renderStatusBadge}
        renderCarteiraBadge={renderCarteiraBadge}
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
        renderStatusBadge={renderStatusBadge}
        renderCarteiraBadge={renderCarteiraBadge}
      />
    </div>
  );
};

export default Spreadsheet;