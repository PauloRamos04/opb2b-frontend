'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSpreadsheet } from '@/contexts/SpreadsheetContext';
import { useTheme } from '@/contexts/ThemeContext';
import Header from '@/components/Header';
import Table from '@/components/Table';
import Popup from '@/components/Popup';
import { RefreshCw, X } from 'lucide-react';
import { getUniqueValues, filterData, parseDate } from '@/utils/functions';
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
import { usePopup } from '@/hooks/usePopup';
import { useChamadoActions } from '@/hooks/useChamadoActions';

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

  const { popup, setPopup, abrirPopup, fecharPopup } = usePopup();

  const { pegarChamado, adicionarAndamento, salvarAlteracoesPopup } = useChamadoActions(
    popup,
    setPopup,
    formValues,
    setFormValues,
    novoAndamento,
    setNovoAndamento,
    fecharPopup
  );

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

    // Função para parsear datas no formato DD/MM HH:mm (assume ano atual)
    function parseDataAberturaLocal(dateStr: string): Date | null {
      if (!dateStr) return null;
      // DD/MM HH:mm
      const match = dateStr.match(/(\d{1,2})\/(\d{1,2}) (\d{1,2}):(\d{1,2})/);
      if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1;
        const hour = parseInt(match[3], 10);
        const minute = parseInt(match[4], 10);
        const year = new Date().getFullYear();
        return new Date(year, month, day, hour, minute, 0);
      }
      // fallback para parseDate padrão
      return parseDate(dateStr);
    }

    // Ordenação: OPERADOR = 'LIVRE' primeiro, mais recentes no topo
    const sorted = filtered.sort((a, b) => {
      const operadorA = a[COLUMN_INDICES.OPERADOR] || '';
      const operadorB = b[COLUMN_INDICES.OPERADOR] || '';
      const dataA = parseDataAberturaLocal(a[COLUMN_INDICES['DATA ABERTURA']]);
      const dataB = parseDataAberturaLocal(b[COLUMN_INDICES['DATA ABERTURA']]);

      // Prioriza chamados com OPERADOR 'LIVRE'
      if (operadorA === 'LIVRE' && operadorB !== 'LIVRE') return -1;
      if (operadorA !== 'LIVRE' && operadorB === 'LIVRE') return 1;

      // Dentro do mesmo grupo, ordena por data de abertura (mais recente primeiro)
      if (dataA && dataB) {
        return dataB.getTime() - dataA.getTime();
      }
      return 0;
    });

    const filteredWithOriginalIndex = sorted.map((rowData) => {
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

  const abrirPopupComEstado = (tipo: 'detalhes' | 'novo', dados: any = null, linha: number | null = null) => {
    abrirPopup(tipo, dados, linha);
    setNovoAndamento('');
    if (dados) {
      setFormValues(dados);
    }
  };

  const fecharPopupComEstado = () => {
    fecharPopup();
    setNovoAndamento('');
    setFormValues({});
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
        abrirPopup={abrirPopupComEstado}
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
        fecharPopup={fecharPopupComEstado}
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